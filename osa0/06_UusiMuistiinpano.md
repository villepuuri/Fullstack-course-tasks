
```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: 201 created
    deactivate server

    POST-komento lisää serverille kyseisen tietueen. JSON-koodi puolestaan lisää tietueen suoraan jo sivulle, jolloin erillistä sivun päivitystä ei tarvita.
    

```
