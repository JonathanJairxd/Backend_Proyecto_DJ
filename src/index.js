import app from './server.js'

//Conexión a la base de datos
import connection from './database.js'

app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})

//Base de datos
connection()