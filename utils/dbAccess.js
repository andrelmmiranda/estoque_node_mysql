const access = (data, database)=> data.replace('${key}', database);

module.exports = {
    access
};