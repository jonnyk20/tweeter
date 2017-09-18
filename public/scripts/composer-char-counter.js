$(function(){
  const charMax = 140;
  $('.new-tweet').on('input','textarea', function() {
    const $this = $(this);
    let length = $this.val().length;
    let counterSpan = $this.closest('.new-tweet').find('.counter');
    counterSpan.text( 140 - length );
    if ( length > charMax ) {
      counterSpan.addClass('error');
    } else {
      counterSpan.removeClass('error');
    }
  });
});

