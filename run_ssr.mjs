import handler from './.netlify/v1/functions/ssr/ssr.mjs';
(async ()=>{
  try{
    const req = new Request('https://localhost/');
    const context = { ip: '127.0.0.1' };
    const res = await handler(req, context);
    console.log('STATUS', res.status);
    console.log('HEADERS', Object.fromEntries(res.headers.entries()));
    const body = await res.text();
    console.log('BODY_START');
    console.log(body.slice(0,2000));
  }catch(e){
    console.error('HANDLER_ERROR');
    console.error(e);
    process.exitCode = 1;
  }
})();
