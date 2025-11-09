import mongoose from 'mongoose';


const URI = "mongodb+srv://diegolarripa:159753az@cluster0.xhszcop.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority";

const dbConnection = async () => {
    try {
        await mongoose.connect(URI);
        console.log("¡Conectado a la base de datos MongoDB Atlas con éxito!");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
};

export default dbConnection;