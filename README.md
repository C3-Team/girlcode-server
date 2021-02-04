**GirlCode API documentation**
----
  
* **api/needs**
* **api/needs/need-id**
* **api/inventories**
* **api/inventories/inventory-id**
* **Method:**
  
  <_The request type_>

  `GET` | `POST` | `DELETE` | `PATCH`
  
*  **URL Params**

   **Optional:**
 
   `need-id=[integer]`
*  **URL Params**

   **Optional:**
   `inventory-id=[integer]`

* **Data Params**
   **Required:**
 `user_name=[string]`
 `email = [string]`
 `tampons=[integer]`
 `pads=[integer]`
 `need_location=[integer]`
 
 * **Data Params**
   **Required:**

`user_name=[string]`
 `email = [string]`
 `tampons=[integer]`
 `pads=[integer]`
 `inventory_location=[integer]`
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ 
    id= 1
    user_name= test name
    email = test@test.com
    tampons=5
    pads=10
    need_location=TX
    }`
     **Content:** `{ 
    id= 1
    user_name= test name
    email = test@test.com
    tampons=5
    pads=10
    inventory_location=TX
    }`
    
 
* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ Missing '${key}' in request body  }`

* **Sample Call:**

GET https://fierce-caverns-70893.herokuapp.com/api/needs/1

GET https://fierce-caverns-70893.herokuapp.com/api/inventories/1


POST https://fierce-caverns-70893.herokuapp.com/api/needs

POST https://fierce-caverns-70893.herokuapp.com/api/inventories


PATCH https://fierce-caverns-70893.herokuapp.com/api/needs/1

PATCH https://fierce-caverns-70893.herokuapp.com/api/inventories/1


DELETE https://fierce-caverns-70893.herokuapp.com/api/needs/1

DELETE https://fierce-caverns-70893.herokuapp.com/api/inventories/1
