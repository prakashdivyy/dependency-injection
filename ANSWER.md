# Answer

## Part 1
1. Why the type of ```store``` is ```Store``` and not ```Memstore```?
   
   Karena module Memstore mengexport Store sebagai module, oleh karena itu untuk mengakses object tersebut maka harus menggunakan Store
   
2. What design patterns do you recognize here?

    Design pattern yang digunakan pada bagian ini adalah Facade pattern, dimana proses pemanggilan dilakukan semudah mungkin sehingga code menjadi lebih ringkas. (https://en.wikipedia.org/wiki/Facade_pattern)

## Part 2
1. What is the advantage of having initialization in configuration file?

   Kita tidak perlu membuat file baru yang menginisialisasi program ini, cukup mengganti file config dan program langsung dapat berjalan

2. What is this pattern called?

   Design pattern yang digunakan pada bagian ini adalah Depedency Injection (https://en.wikipedia.org/wiki/Dependency_injection)

3. If you created a ```DBStore``` with path ```components/store/db_store``` what do you need to do to swap the implementation.

   Buat object pada ```components``` dengan nama key ```DBStore``` dengan value berupa object dengan key ```file``` dengan value ```components/store/db_store.js``` dan key ```depedencies``` dengan value ```[]``` dan ubah ```depedencies``` pada ```userRepo``` dan ```convRepo``` menjadi ```["DBStore"]```
   
   ```json
    {
       "components": {
           "DBStore": {
               "file": "components/store/db_store.js",
               "depedencies": []
           },
           "convRepo": {
               "file": "components/repo/conversation_repo.js",
               "depedencies": ["DBStore"]
           },
           "userRepo": {
               "file": "components/repo/user_repo.js",
               "depedencies": ["DBStore"]
           }
       },
       ...
    }
   ```

4. Define steps to be done if you want to have the configuration file definable in environment variable like this:
    ```sh
    //bash
    $ export WAREHOUSE_SERVICE_STORE_COMPONENT=components/store/db_store.js
    $ node start.js {
        "components": {
            "store": {
                "file": "{$WAREHOUSE_SERVICE_STORE_COMPONENT}",
                "depedencies": []
            },
            ...
        }
    //bash
    $ export WAREHOUSE_SERVICE_STORE_COMPONENT=components/store/db_store.js
    $ node start.js
    ```
    
    Cek apakah sesuai dengan regex environment variable. Jika sesuai ambil environment variable dengan menggunakan ```process.env[ENV_VARIABLE]```. Berikut perubahan pada injector.js line 17-21:
    
    ```js
    Object.keys(configComponents).forEach(function (e) {
        let file = configComponents[e].file;
        let pattern = /{\$[A-Z_]+}$/g;
        if(pattern.test(file)){
           module[e] = require("./" + process.env[file.slice(2, -1)]);
        } else {
           module[e] = require("./" + path.dirname(file) + "/" + path.basename(file, '.js'));
        }
        listComponents.push(e);
    });
    ```

## Part 3

1. What is the benefit of this change?

   Karena ```userRepo``` dan ```conversationRepo``` dalam implementasinya sama maka dapat dibuat sebuah modul generic dari kedua modul tesebut, sehingga sebuah modul dapat digunakan berkali-kali untuk object yang berbeda
    
2. What should I change if I want to add new path ```/token``` with following fields: ```string token; int expire;```

   Berikut konfigurasi file ```config.json``` untuk ```/token```:
   ```json
   {
      "components": {
          ...
          "token": {
              "file": "components/token/token.js",
              "depedencies": ["store"],
              "options": {
                 "schema": {
                     "token": "string",
                     "expire": "int"
                 }
              }
          },
          "server": {
             "file": "components/server/api_server_generic.js",
             "depedencies": ["convRepo", "userRepo", "token"],
             "options": {
                 "routes": ["/conversations", "/users", "/token"]
             }
          }
      },
      ...
   }
   ```
   Jangan lupa untuk mengubah constructor dari ```injector-generic``` menjadi 4 buah parameter