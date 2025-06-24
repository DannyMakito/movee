import { Client, Databases, Query ,ID} from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
//const  ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;



const client = new Client()
.setEndpoint('https://fra.cloud.appwrite.io/v1')
.setProject(PROJECT_ID)

const database = new Databases(client);


export const updateSearchCount = async(searchTerm,movie) =>{
//1 USE APPWRITE SDK TO CHECK IF THE search term exist in the db
try {
    const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
        Query.equal('searchTerm',searchTerm),
    ])
//2 if it does update db
    if(result.documents.length >0){
        const doc = result.documents[0];

        await database.updateDocument(DATABASE_ID,COLLECTION_ID,doc.$id,{
            count: doc.count +1,
        })
// 3 if it doesnt create a new docwith searchterm and count of 1
    }else{
        await database.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
            searchTerm,
            count:1,
            movie_id:movie.id,
            poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        })
    }
} catch (error) {
    console.log(error)
}

//
}