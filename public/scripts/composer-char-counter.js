
$(function foo() {
  const charMax = 140;
  $('.new-tweet').on('input', 'textarea', () => {
    const $this = $(this);
    const { length } = $this.val();
    const counterSpan = $this.closest('.new-tweet').find('.counter');
    counterSpan.text(140 - length);
    if (length > charMax) {
      counterSpan.addClass('error');
    } else {
      counterSpan.removeClass('error');
    }
  });
});
