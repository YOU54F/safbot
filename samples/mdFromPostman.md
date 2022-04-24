# API Example Products API (example based)

## Auth
- Header Bearer: `Bearer 1234`

## Items
### `GET`: GET /products
Get all products

`{{host}}/products`

**Sample**
```shell
$ curl -X GET {{host}}/products
```

### `GET`: GET /products/:id
Get single product

`{{host}}/products/{{id}}`

**Sample**
```shell
$ curl -X GET {{host}}/products/{{id}}
```

### `POST`: POST /products/ (200)
Create a product

`{{host}}/products`

**Header**

| Header | type | Value | Description |
| --- | --- | --- | --- |
| Content-Type | text | application/json |  |

**Body**
```json
{
    "id": "09",
    "name": "Gem Visa",
    "type": "CREDIT_CARD",
    "price": 99.99,
    "version": "v1"
}
```

**Sample**
```shell
$ curl -X POST {{host}}/products \
    -H 'Content-Type: application/json' \
    -d '{
    "id": "09",
    "name": "Gem Visa",
    "type": "CREDIT_CARD",
    "price": 99.99,
    "version": "v1"
}'
```

