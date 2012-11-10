Penguin = {}

Penguin.Books = function(){
    $.ajax({
       type: 'GET',
       url: Penguin.Url + 'books',
       data: {
           apikey: Penguin.ApiKey,
           limit: 10
       },
       dataType: 'jsonp',
       jsonp: 'jsonp',
       success: function(json){
           //console.log(json)
           for (var i = 0; i<json.books.length; i++){
               Penguin.Book(json.books[i].id)
           }
           
       },
       error:function(e){
           console.log(e)
       }
       
    });
}

Penguin.Book = function(book_id){
    $.ajax({
       type: 'GET',
       url: Penguin.Url + 'books/' + book_id,
       data: {
           apikey: Penguin.ApiKey
       },
       dataType: 'jsonp',
       jsonp: 'jsonp',
       success: function(json){
           Penguin.Article(json.book.articles[0].id)
       },
       error:function(e){
           console.log(e)
       }
    });
}
Penguin.Article = function(article_id){
    $.ajax({
       type: 'GET',
       url: Penguin.Url + 'articles/' + article_id,
       data: {
           apikey: Penguin.ApiKey
       },
       dataType: 'jsonp',
       jsonp: 'jsonp',
       success: function(json){
           console.log(Penguin.FirstTwoParagraphs(json.article.content))
       },
       error:function(e){
           console.log(e)
       }
    });
}
Penguin.FirstTwoParagraphs = function(content){
    var p = 0;
    var paragraphs = '';
    for (var i = 0; i <content.length; i++){
        if (p > 1){
            break
        }
        if (content[i].p != undefined){
            paragraphs += content[i].p[0].text;
            p ++;
        }
    }
    return paragraphs;
}
$(function(){
    Penguin.ApiKey = '36fc10e2f13c5935b01566ece096e394';
    Penguin.Url = 'https://api.pearson.com/penguin/classics/v1/';
    Penguin.Books();
});