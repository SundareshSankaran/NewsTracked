
// Please change to your NYT API Key

var settings= {
    apiKey:"uDheiwakild87O8GMTXEFtygpGaHGSGs" ,
    "url": "https://api.nytimes.com/svc/news/v3/content/all/all.json",
    limit:5,
    offset:0,
    makeUrl: function(){
      return {url:this.url+"?api-key="+this.apiKey+"&limit="+this.limit+"&offset="+this.offset,
              method:'GET'
              };
    }

       
  
    }
  ;

  var session;

  var b="title~abstract~byline~url\n";

    // this block identifies the access token
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
    urlstring = $(location).attr('hash'),
    searchstr = $(location).attr('search'),
    params={},
    match;

    while(match = regex.exec(urlstring)) {
        params[match[1]] = match[2];
    };

    while(match = regex.exec(searchstr)) {
        params[match[1]] = match[2];
    };



console.log("Access Token details");
console.log(params);
  
  $.ajax(settings.makeUrl()).done(function (nytresponse) {
                                          console.log("response");
                                          console.log(nytresponse);
                                                          
                                              // item_type
                                              // byline
                                              // abstract
                                              // created_date
                                              // title 
                                              // des_facet
                                              // geo_facet
                                              // url
                                              // section 
                                              // subsection
                                              // thumbnail_standard

                                            


                                          $("#nytTable").empty();

                                          $("#nytTableRow").append($("<table>",{id:"nytTable",class:"table table-striped"}).append($("<thead>").append($("<tr>").append($("<th>",{text:"Title"})).append($("<th>",{text:"Byline"})).append($("<th>",{text:"Abstract"})))));
      
                                          for (var a =0; a < nytresponse.results.length; a++){

                                              $("#nytTable").append($("<tr>").append($("<td>",{id:((((nytresponse.results[a].url).replace(/\./g,"")).replace(/\:/g,"")).replace(/\//g,"")).replace(/-/g,"")}).append($("<a>",{text:nytresponse.results[a].title, href:nytresponse.results[a].url}))).append($("<td>",{text:nytresponse.results[a].byline})).append($("<td>",{id:"text"+((((nytresponse.results[a].url).replace(/\./g,"")).replace(/\:/g,"")).replace(/\//g,"")).replace(/-/g,""),text:nytresponse.results[a].abstract})));

                                              b= b+nytresponse.results[a].title+"~"+nytresponse.results[a].abstract+"~"+nytresponse.results[a].byline+"~"+nytresponse.results[a].url+'\n';


                                          };


                                          $("#controlPanel").append($("<button>",{class:"btn btn-primary",style:"align-left:true;", id:"loadTable", text:"Load to CAS"}))


                                          $("#loadTable").click(function(){
                                            console.log("clicked");
                                            var settings = {
                                              "async": true,
                                              "crossDomain": true,
                                              "url": params.host+":8777/cas/sessions",
                                              "method": "POST",
                                              "headers": {
                                                "Accept": "*/*",
                                                "Authorization": "Bearer "+ params.access_token
                                              }
                                            }
                                            
                                            $.ajax(settings).done(function (response) {
                                              console.log(response);
                                              session = response.session;

                                              settings["url"] = settings['url']+"/"+session+"/actions/"+"upload";
                                              settings["method"] = "PUT";
                                              settings["headers"]["JSON-Parameters"] = JSON.stringify({"casout": {"caslib": "PUBLIC", "name": "LTABLE", "replace":true },  "importOptions": {"fileType":"CSV","delimiter":"~"} });
                                              settings["headers"]["Content-Type"]= "binary/octet-stream";
                                              var newb="";
                                              console.log(b);

                                              // b.forEach(function(a){
                                              //                                         console.log(a);
                                              //                                         console.log(Object.keys(a).map(function(k) {
                                              //                                           return a[k];
                                              //                                         }).join(',')+"\n");
                                              //                                          newb+=(Object.keys(a).map(function(k) {
                                              //                                                                                 return a[k];
                                              //                                                                               }).join(',')+"\n");
                                              //                                         });

                                              settings["data"]=b;

                                              $.ajax(settings).done(function (response) {
                                                console.log("REsponse from Load Table upload");
                                                console.log(response);
                                                settings["method"]="POST";
                                                settings["url"]=params.host+":8777/cas/sessions/"+session+"/actions/"+"save";
                                                settings["headers"]["Content-Type"]= "application/json";
                                                settings["data"]=JSON.stringify({caslib:"PUBLIC",name:"LTABLE.sashdat", replace:true,table:{caslib:"PUBLIC",name:"LTABLE"}});
                                                $.ajax(settings).done(function (response) {
                                                                  console.log("Response from Load Table upload");
                                                                console.log(response);

                                                }).error(function(err){ console.log("Error in table upload");
                                                console.log(err);
                                                console.log(settings);
                                              });;

                                              }).error(function(err){ console.log("Error in table upload");
                                                                      console.log(err);
                                                                      console.log(settings);
                                                                    });;

                                            });
                                              
                                          
                                          });













                                              }).error(function(err){ console.log("Error");
                                                                      console.log(err);
                                                                    }); 




;
$("#categories").click(function(){
  console.log("Clicked on Categories");
  var settings = {
                   "url": params.host+"/SASJobExecution/?_program=%2FPublic%2FAI%20Hackathon%2FNatural%20Language%20Processing%2FJobs%2FscoreCategories",
                                  "method": "GET",
                                  "timeout": 0,
                                  "headers": {
                                    "Authorization": "Bearer "+params.access_token
                                  }
                                };
                                
                                
                              
                                $.ajax(settings).done(function (response) {
                                  console.log(response);
                                  for (var a = 0; a < response.length; a++){
                                     $("#"+(((response[a]["url"].replace(/\./g,"")).replace(/\:/g,"")).replace(/\//g,"")).replace(/-/g,"")).append($("<br>")).append($("<td>",{id:response[a]["_category_"], class:"badge badge-success badge-light", text:response[a]["_category_"]}));



                                  };
                                  
                              
                              
                                }).error(function(error){console.log(error)});
                                ;
                              
    } );

    $("#concepts").click(function(){
      console.log("Clicked on Concepts");
      var settings = {
                       "url": params.host+"/SASJobExecution/?_program=%2FPublic%2FAI%20Hackathon%2FNatural%20Language%20Processing%2FJobs%2FscoreConcepts",
                                      "method": "GET",
                                      "timeout": 0,
                                      "headers": {
                                        "Authorization": "Bearer "+params.access_token
                                      }
                                    };
                                    
                                    
                                  
                                    $.ajax(settings).done(function (response) {
                                      console.log(response);
                                      for (var a = 0; a < response.length; a++){
                                        var tagg="#text"+((((response[a].url).replace(/\./g,"")).replace(/\:/g,"")).replace(/\//g,"")).replace(/-/g,"");
                                        console.log($(tagg).text());
                                        var taggtext = $(tagg).text();
                                        var tagghtml = $(tagg).html();
                                        index = taggtext.indexOf(response[a]._match_text_);
                                        console.log(index);


                                        if (index !== -1) {

                                                var htmlR = taggtext.substr(0, index) + `<b style="background-color:yellow;">` + taggtext.substr(index, response[a]._match_text_.length) + `</b>` + taggtext.substr(index + response[a]._match_text_); // ***
                                                $(tagg).val("");
                                                $(tagg).append($("<tr>",{class:"badge-light badge",text:response[a]._match_text_}));
                                                console.log($(tagg));
                                        };

                          



                                      };
                                      
                                  
                                  
                                    }).error(function(error){console.log(error)});
                                    ;
                                  
        } );