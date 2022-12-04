const {nanoid} = require('nanoid');
const books = require("./books");

const addBook = (request, h) => {
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
};

if (name === undefined) {
    const response = h.response({
        status:'fail',
        message: 'Gagal menambahkan buku, silahkan isi nama buku',
    })

    response.code(400);
    return response;
}

if (readPage > pageCount) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku, halaman terbaca tidak boleh lebih besar dari jumlah halaman'
    })

    response.code(400);
    return response;
}

const id = nanoid(16);
const finished = pageCount === readPage;
const insertedAt = new Date().toISOString();
const updatedAt = insertedAt;

const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt,updatedAt
};

books.push(newBook); //menambahkan buku baru

const isSuccess = books.filter((book) => book.id === id).length > 0;

//buku berhasil ditambahkan
if (isSuccess) {
    const response = h.response ({
        status: 'success',
        message:'Buku berhasil ditambahkan',
        data:{
            bookId: id,
        },
    })

    response.code(201);
    return response;
};

//buku gagal ditambahkan
const response = h.response
({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
})

response.code(500);
return response;

const getAllBooks = (request, h) => {
    const {name, reading, finished } = request.query;

    //tidak ada query
    if (!name && !reading && !finished) {
        const response = h.response ({
            status: 'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        })
        
        response.code(200);
        return response;
    }

    //ada query name
    if(name) {
        const response = h.response({
            status: 'success',
            data: {
                books: books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });

        response.code(200);
        return response;
    }

    //ada query reading
    if(reading) {
        const response = h.response({
            status: 'success',
            data: {
                books: books.filter((book) => Number(book.reading) === Number(reading)).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });

        response.code(200);
        return response;
    }

    //ada query finished
    if(finished) {
        const response = h.response({
            status: 'success',
            data: {
                books: books.filter((book) => Number(book.finished) === Number(finished)).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });

        response.code(200);
        return response;
    }
};

const getBookbyId = (request, h) => {
    const {id} = request.params;

    const book = books.filter((x) = x.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message:'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
};

const editBookById = (request, h) => {
    const {id} = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    const updateAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        if (name === undefined) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal mengubah buku, Silakan isi nama buku',
            });

            response.code(400);
            return response;
        }

        if (pageCount < readPage) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku, halaman terbaca tidak boleh lebih besar dari jumlah halaman'
            });

            response.code(400);
            return response;
        }

        const finished = (pageCount === readPage);

        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Berhasil diperbarui',
        });

        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal diperbarui. Id tidak ditemukan',
    });
    
    response.code(404);
    return response;
};

const deleteBookById = (request, h) => {
    const {id} = request.params;

    const index = books.findIndex((book) => book.id === id);

    if(index !== -1) {
        books.splice(index,1);
        const response = h.response({
            status: 'success',
            message: 'Berhasil dihapus',
        });

        response.code(200);
        return response;
    }

    const response = h.response({
        status:'fail',
        message:'Buku gagal dihapus. Id tidak ditemukan',
    });

    response.code(404);
    return response;
};

module.exports = {addBook, getAllBooks, getBookById, editBookById, deleteBookById};
