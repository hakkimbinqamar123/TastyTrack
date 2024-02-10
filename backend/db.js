const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://hakkimbinqamar:tastytrack123@cluster0.uo3gfom.mongodb.net/tastytrackmern?retryWrites=true&w=majority';

const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");
        const fetched_data = mongoose.connection.db.collection("food_items");
        const data = await fetched_data.find({}).toArray();
        global.food_items = data;


        const foodCategory = mongoose.connection.db.collection("food_category");
        const data2 = await foodCategory.find({}).toArray();
        global.foodCategory = data2;
        // foodCategory.find({}).toArray(function (err, catData) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         global.food_items = data;
        //         global.foodCategory = catData;
        //     }
        // });
        // console.log("After foodCategory.find");
        // // console.log(data);
        // // global.food_items = data;
        // // console.log(global.food_items)
        // console.log(data2)

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

module.exports = mongoDB;
