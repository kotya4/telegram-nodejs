let TOKEN
let _parameters
let _path

function load( path_or_obj ){
  return new Promise(( rs,rj )=>{
    if(typeof path_or_obj==='string')return require( 'fs' ).readFile( path_or_obj, 'utf8', (err,data)=>{
      if(err)return rj( Error( 'Load argument was interpreted as path, but no file was found. File must contain json like `{"token":<your token here>}`', { cause: err } ) )
      _path=path_or_obj
      _parameters=JSON.parse(data)
      TOKEN=_parameters.token
      return rs()
    })
    if(typeof path_or_obj==='object'&&path_or_obj.token){
      _parameters=path_or_obj
      TOKEN=_parameters.token
      return rs()
    }
    return rj(Error( 'Load argument must be path as string or options as object' ))
  })
}

function call( m, args={} ){
  return new Promise(( rs, rj )=>{
    if(!TOKEN)return rj( Error( 'No token provided, you must load options first' ) )
    const urlp=( a )=>'?'+Object.keys( a ).map(key=>key+'='+a[key]).join( '&' ) // url params
    const murl=( m )=>`/bot${ TOKEN }/${ m }` // method url
    const opts=
    { hostname: 'api.telegram.org'
    , port: 443
    , path: murl( m )+urlp ( args )
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

function parameter( key ){
  if(!_parameters)throw Error( 'Parameters are not loaded' )
  return {
    get( _default_ ){
      return ( _parameters[key]=_parameters[key]||_default_ )
    },
    set( value ){
      _parameters[key]=value
      if(_path)require( 'fs' ).writeFile( _path, JSON.stringify(_parameters), 'utf8', ()=>{} )
      return value
    },
  }
}

module.exports={ load, call, parameter }
