const { nanoid } = require('nanoid');
const books  = require('./books');

const addbookHandler = (request, h) => {
    const { 
        name, 
        year, 
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading 
    } = request.payload;
    
    
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (pageCount==readPage);

    if(name == null || name == ""){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;    
    }

    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;    
    }


    const newbook = {
        id, 
        name, 
        year, 
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading, 
        finished,
        insertedAt, 
        updatedAt,
    };
    
    

    books.push(newbook);    
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
    
};
  

const getAllbooksHandler = (request,h) => {
    
    const { 
        name, 
        reading, 
        finished 
    } = request.query;

    let booksFilter = books;
    booksFilter = booksFilter.filter((book)=>         
        ((book.name.toLowerCase().includes((name) ? name.toLowerCase() : name)) || !name) &&
        ((book.reading == (reading == 1)) || (reading != 0 && reading != 1)) &&
        ((book.finished == (finished == 1)) || (finished != 0 && finished != 1))
    );

    const bookList = booksFilter.map((item)=>{
        return {
            id: item.id,
            name: item.name,
            publisher: item.publisher    
        }
    });
    
    const response = h.response({
        status: 'success',
        data: {
            books : bookList
        },      
    });
    response.code(200);
    return response;
}


const getbookByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const book = books.filter((n) => n.id === id)[0];
   
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
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};
  

const editbookByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const { 
        name, 
        year, 
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading 
    } = request.payload;

    
    if(name == null || name == ""){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;    
    }

    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;    
    }

    const updatedAt = new Date().toISOString();
    const finished = (pageCount==readPage);

    const index = books.findIndex((book) => book.id === id);
   
    if (index !== -1) {
      books[index] = {
        ...books[index],
        name, 
        year, 
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt
        
      };
   
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
   
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
  

const deletebookByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const index = books.findIndex((book) => book.id === id);
   
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
   
   const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
   

  
module.exports = { addbookHandler,getAllbooksHandler, getbookByIdHandler, editbookByIdHandler, deletebookByIdHandler };
