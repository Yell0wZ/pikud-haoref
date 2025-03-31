module.exports = async (data, db) => {



    const usersSnapshot = await db.collection("users").get();

    const usersArray = [];

        usersSnapshot.forEach(doc => {
      const userId = doc.id;
      const userData = doc.data();
      usersArray.push({
        phone: userId,
        ...userData
      });
    });
    return usersArray;
}