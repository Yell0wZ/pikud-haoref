module.exports = async (data, db) => {


const doc = await db.collection("schedule").doc("data").get()
const docData = doc.data()


return docData


}