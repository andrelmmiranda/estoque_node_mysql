const submitDisable = () => $('#titulo').val() === '' || $('#autor').val() === '' ?
    $('[type="submit"]').prop('disabled', true)
: 
    ($('[type="submit"]').prop('disabled', false), console.log('funfs'));