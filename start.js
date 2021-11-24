const{ load, call, parameter }=require( './tgcore' )
load( './chatwithkotyabot.json' )

// greetings
  .then( ()=>call( 'getMe' ) )
  .then( JSON.parse )
  .then( ( { result } )=>console.log( result ) )
  .then( ()=>console.log( '='.repeat( 20 ) ) )

// longpoll
  .then( ()=>{
    let offset=parameter( 'offset' ).get( 0 )
    const timeout=parameter( 'timeout' ).get( 60*60 )
    function longpoll(){
      return call( 'getUpdates', { timeout, offset } )
              .then( JSON.parse )
              .then( ( { result } )=>
                  ( result[ result.length-1 ] )
                  && // on new message receive
                  ( result.forEach( ( { message: { message_id, from: { first_name }, date, text } } )=>console.log( { message_id, first_name, date, text } ) ) // print message
                  , ( offset=parameter( 'offset' ).set( result[ result.length-1 ].update_id+1 ) ) // update offset
                  , ( require( 'child_process' ).execFile( './sound.exe', ()=>{} ) ) // play sound
                  )
                )
              .then( longpoll )
    }
    longpoll()
  } )

// errs
  .catch( (...a)=>console.log( a ) )
