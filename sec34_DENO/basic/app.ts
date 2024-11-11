const handler = (request: Request): Response => {
    const url = new URL(request.url);
    console.log(request.url)
    console.log(url)
    if (url.pathname === "/") {
      return new Response("Welcome to the Home Page!\n", { status: 200 });
    } else if (url.pathname === "/about") {
      return new Response("About Us Page\n", { status: 200 });
    } else {
      return new Response("Page Not Found\n", { status: 404 });
    }
  }; 
Deno.serve({ port: 3000 }, handler);
/* 
Deno.serve({ port: 3000 }, (_req) => {
    return new Response("Hello, World!");
});
 */ 
