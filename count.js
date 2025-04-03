async function getCount() {
    try {
        const count = await mongoModel.countDocuments();
        console.log('Number of entries in the database:', count);
    } catch (error) {
        console.error('Error fetching count:', error);
    }
}
module.exports={getCount}