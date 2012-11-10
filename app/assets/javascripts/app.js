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
               var j = json;
               Penguin.Article(j.book.articles[0].id, j.book.title, j.book.authors[0])
               
           },
           error:function(e){
               console.log(e)
           }
        });
}
Penguin.Article = function(article_id, title, author){
    $.ajax({
       type: 'GET',
       url: Penguin.Url + 'articles/' + article_id,
       data: {
           apikey: Penguin.ApiKey
       },
       dataType: 'jsonp',
       jsonp: 'jsonp',
       success: function(json){
            OpenDover.SearchSentiments(Penguin.FirstTwoParagraphs(json.article.content), title, author)
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

OpenDover = {}

OpenDover.SearchSentiments = function(text, title, author){
    if(!OpenDover.Calling){
        OpenDover.Calling = true;
        $.ajax({
           type: 'POST',
           url: '/open-dover',
           data: {
               url: OpenDover.Url + 'search_sentiments?apiKey=' + OpenDover.ApiKey,
               data: {text: text}
           },
           success: function(json){
                OpenDover.Calling = false; OpenDover.parseSentiments(json.searchSentimentsResponse, title, author)
           },
           error:function(json){
                OpenDover.Calling = false;
                OpenDover.parseSentiments(json.searchSentimentsResponse, title, author)
           }
        });
    }
    else{
        setTimeout(function () {
            OpenDover.SearchSentiments(text, title, author)
        }, 3000);
    }
}

OpenDover.parseSentiments = function(sentiment, title, author){
    var domain = [];
    var sentiments = [];
    if (sentiment != undefined){

        if (sentiment.domainWords != undefined){
            if (sentiment.domainWords.domainWord != undefined){
                domain = [sentiment.domainWords.domainWord.cleanText];
            }
            else{
                for (var i =0; i< sentiment.domainWords.length; i++){
                    domain.push(sentiment.domainWords[i].domainWord.cleanText)
                }
            }
        
        }
        if (sentiment.domainWords != undefined){
            if (sentiment.domainWords.domainWord != undefined){
                domain = [sentiment.domainWords.domainWord.cleanText];
            }
            else{
                for (var i =0; i< sentiment.domainWords.length; i++){
                    domain.push(sentiment.domainWords[i].domainWord.cleanText)
                }
            }
        
        }
}
    var html = "<div class = 'book'>";
    html += "<div class = 'title'>" + title + "</div>";
    html += "<div class = 'author'> By: " + author.full_name;
    if (domain != null){
        html += "<div class = 'topic'>" + domain.join(' -- ') + "</div>"
    }
    if (sentiments.length > 0){
        html += "<div class = 'sentiment'>" + sentiments.join(' -- '); + "</div>"
    }
    html += '</div>';
    
    $('#results').prepend(html);    
}
$(function(){
    Penguin.ApiKey = '36fc10e2f13c5935b01566ece096e394';
    Penguin.Url = 'https://api.pearson.com/penguin/classics/v1/';
    OpenDover.ApiKey = 't4v8ga8xg5tkm8b5zya8833s';
    OpenDover.Url = ' http://api.opendover.nl/rest/v1/json/';
    OpenDover.Calling = false
    Penguin.Books();
});