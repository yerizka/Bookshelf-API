const { addBook, getAllBooks, getBookById, editBookById, deleteBookById } = require("./handler");

const routes = [
    //add book
    {
        method: 'POST',
        path: '/books',
        handler: addBook,
    },

    //all book
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooks,
    },

    //getbookbyId
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookById,
    },

    //editbookbyId
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: editBookById,
    },

    //deletebookbyid
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: deleteBookById,
    },
];

module.exports = routes;
