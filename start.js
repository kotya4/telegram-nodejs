const{ load, call, parameter }=require( './tgcore' )
load( './chatwithkotyabot.json' )
// greetings
  .then ( ()=>console.log( ' TELEGRAM BOT SERVER \n @chatwithkotyabot ' ) )
  .then( ()=>call( 'getMe' ) )
  .then( JSON.parse )
  .then( ( { result } )=>console.log( result ) )
  .then( ()=>console.log( '='.repeat( 20 ) ) )
// longpoll
  .then( ()=>{
    let offset=parameter( 'offset' ).get( 0 )
    let users=parameter( 'users' ).get( {} )
    const timeout=parameter( 'timeout' ).get( 60*60 )
    function longpoll(){
      return call( 'getUpdates', { timeout, offset } )
              .then( JSON.parse )
              .then( ( { result } )=>
                  // ( console.log ( result, result[0].message.from )
                  // , console.log ( '##################' )
                  // , 1
                  // )
                  // &&
                  ( result[ result.length-1 ] )
                  && // on new message receive
                  ( ( result.forEach( interpret ) ) // print message
                  , ( offset=parameter( 'offset' ).set( result[ result.length-1 ].update_id+1 ) ) // update offset
                  , ( users=parameter( 'users' ).set( users ) ) // update users
                  , ( require( 'child_process' ).execFile( './sound.exe', ()=>{} ) ) // play sound
                  )
                )
              .then( longpoll )
      function interpret( { message: { from: { username }, date, text } } ){
        const randchar=()=>'0123456789abcdefgijklmnoprstuqyxz'[ Math.random()*'0123456789abcdefgijklmnoprstuqyxz'.length|0 ]
        const just_created=!( username in users )
        const user=users[ username ]=users[ username ]||
          { msgs_num: 1
          , first_msg_at: date
          , label: Array
              .from( { length:1+Math.random()*4|0 } )
              .map( randchar )
              .join( '' )
              .toUpperCase()
          }
        if( just_created ){// check for duplicate lables
          for( ;; ){
            if( Object.keys( users ).some( key=>users[ key ]!==user&&users[ key ].label===user.label ) ){
              user.label+=randchar()
              continue
            }
            break
          }
        }
        user.msgs_num++
        console.log( { user: user.label, date, text } )
      }
    }
    longpoll()
  } )

// errs
  .catch( (...a)=>console.log( a ) )
