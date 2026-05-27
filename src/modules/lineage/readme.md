# Lineage workflow

Раздел описывает полный lifecycle export-задачи lineage.

Участники процесса:

```
DB = source of truth | Источник правды
lineage_export_worker = heavy processing layer | Исполнитель по генерации export-файла
core = orchestration layer | Слой оркестрации (создание задачи, проверка статуса)
nginx = file delivery layer | Доставка файла
client = polling client | Клиент (Площадка данных, Дата Каталог, ОМД, ...), посылает запрос на создание файла, периодически опрашивает статус
```

> Состояние export-задачи хранится в БД и является source of truth для всех участников процесса.


1. [client] Клиент отправляет запрос на создание задачи экспорта lineage через `create_lineage_task` и получает `task_id` для последующей проверки статуса задачи:

   ```
   POST /lineage/export
   
   {
     "task_id": 123
   }
   ```


2. [core] Функция `create_lineage_task` извлекает из `object_url` (`url` объекта в Дата Каталоге) параметры, необходимые для создания задачи в БД


3. [lineage_export_worker] Worker выбирает из БД задачи со статусом `new` и создаёт файлы экспорта, обращаясь к EDC API для получения lineage данных.

   Во время обработки происходят переходы статусов:

   ```
   new -> in_progress -> completed/failed
   ```
   
   При успешном создании файла в БД сохраняется путь к export-файлу:

   ```
   path = lineage/some_name.xlsx
   ```
   
   При ошибке задача переводится в статус `failed`. 


4. [client] Пока создаётся файл, Клиент периодически опрашивает `core` для проверки статуса задачи:

   ```
   GET /lineage/123
   
   {
     "status": "completed",
     "result_code": "ready",
     "path": "lineage/some_name.xlsx"
     ...
   }
   ```


5. [client] После успешного завершения задачи:
 
   ```
   GET /lineage/123
   
   {
     "status": "completed",
     "result_code": "ready",
     ...
   }
   ```
   
   клиент показывает ссылку на скачивание файла:

   ```
   GET /lineage/123/download
   ```

6. [core] Controller добавляет в response заголовок `X-Accel-Redirect`, после чего `nginx` выполняет `internal redirect` и самостоятельно отдаёт файл клиенту:

   ```
   client -> core -> nginx internal redirect -> file
   ```

Такой подход позволяет передать nginx тяжёлую работу по отдаче больших файлов, снизить нагрузку на Node.js процесс и избежать лишнего использования оперативной памяти.
