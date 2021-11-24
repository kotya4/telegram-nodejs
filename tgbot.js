let TOKEN

function load( path_or_obj ){
  return new Promise(( rs,rj )=>{
    if(typeof path_or_obj==='string')return require( 'fs' ).readFile( path_or_obj, 'utf8', (err,data)=>{
      if(err)return rj( Error( 'Load argument was interpreted as path, but no file was found. File must contain json like `{"token":<your token here>}`', { cause: err } ) )
      TOKEN=JSON.parse(data).token
      return rs()
    })
    if(typeof path_or_obj==='object'&&path_or_obj.token){
      TOKEN=path_or_obj.token
      return rs()
    }
    return rj(Error( 'Load argument must be path as string or options as object' ))
  })
}

function call( m ){
  return new Promise(( rs, rj )=>{
    if(!TOKEN)return rj( Error( 'No token provided, you must load options first' ) )
    const murl=( m )=>`/bot${ TOKEN }/${ m }` // method url
    const opts=
    { hostname: 'api.telegram.org'
    , port: 443
    , path: murl( m )
    , method: 'GET'
    }
    const req=require( 'https' ).request( opts, ( r )=>{
      const{ statusCode }=r
      let data=''
      r.on( 'data', ( chunk )=>data=data+chunk )
      r.on( 'end', ()=>statusCode===200?rs( data ):rj( Error( 'Server returns statusCode '+statusCode ), { data, r } ) )
    })
    req.on( 'error', ( error )=>{
      rj( error )
    })
    req.end()
  })
}

module.exports={ load, call }
