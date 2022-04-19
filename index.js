const Parser = require('rss-parser');

addEventListener('fetch', event => {
event.respondWith(handleRequest(event))
})
const cloudflareCache = caches.default;

const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Max-Age": "86400",
}

async function handleRequest(event) {

	if (event.request.method === "OPTIONS") {
	    return handleOptions(request)
	}
  
	const cachedResponse = await cloudflareCache.match(event.request);

	if (cachedResponse) {
	  return cachedResponse;
	}

	var url = getSearchFromUrl(event.request.url, "url");

	let originalResponse = await fetch(url)

	// Change status and statusText, but preserve body and headers
	let response = new Response(originalResponse.body, {
		status: 200,
		statusText: 'Successful',
		headers: originalResponse.headers,
	});

    let parser = new Parser({
		  defaultRSS: 2.0,
		  xml2js: {
		    emptyTag: '--EMPTY--',
		  },
		   timeout: 4000,
		   headers: {'x-requested-with': ''},
		   requestOptions: {
		    rejectUnauthorized: false
		  }
		});

	// Change response body by adding the foo prop
	const originalBody = await originalResponse.text(); 
	const body = JSON.stringify({ feed: await parser.parseString(originalBody)}); 
	response = new Response(body, response); 
	response.headers.set("Access-Control-Allow-Origin", "*");
	response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("content-type", "application/json;charset=UTF-8");
	
	return cacheResponse(event, response);

}

function getSearchFromUrl(url, queryParam) {
  	const possibleMatches = url.split("?")[1];
  	const queryParams = new URLSearchParams(possibleMatches);
  	return queryParams.get(queryParam);
}

function cacheResponse(event, response) {
  	return cloudflareCache
    	.put(event.request, response.clone())
    	.then(() => response);
}

function handleOptions (request) {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    let headers = request.headers
    if (
        headers.get("Origin") !== null &&
        headers.get("Access-Control-Request-Method") !== null &&
        headers.get("Access-Control-Request-Headers") !== null
    ) {
        // Handle CORS pre-flight request.
        // If you want to check or reject the requested method + headers
        // you can do that here.
        let respHeaders = {
                ...corsHeaders,
                // Allow all future content Request headers to go back to browser
                // such as Authorization (Bearer) or X-Client-Name-Version
                "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
        }
        return new Response(null, { headers: respHeaders, })
    }
    else {
        // Handle standard OPTIONS request.
        // If you want to allow other HTTP Methods, you can do that here.
        return new Response(null, {
            headers: {
                Allow: "GET, HEAD, POST, OPTIONS",
            },
        })
    }
}
