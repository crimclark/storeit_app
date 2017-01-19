console.log('hello world');
// $(".button-collapse").sideNav();
$('.modal').modal();

$('.delete').click(function(){
  var id = $(this).parent().attr('id');
  $(this).parent().remove();
  $.post('/files/:key/delete', {key: id}, function(response){
    console.log(response);
  });
});

$('.description').click(function(){
  $(this).attr('contenteditable', 'true');
});

$('.description').keydown(function(event){
  var description = $(this).text();
  var id = $(this).parent().attr('id');
  if (event.keyCode === 13) {
    $(this).attr('contenteditable', 'false');
    $.post('/files/:key/update', {description: description, key: id}, function(res){
      console.log(res);
    })
  }
});

$('#tags-input').keydown(function(event){
  var tagsInput = $('#tags-input');
  var tags = $('#tags');
  if (event.keyCode === 13) {
    console.log('pressed enter');
    tags.val(tags.val() + '#' + tagsInput.val() + ' ');
    tagsInput.val('');
  }
});

$(document).on("keypress", ":input:not(textarea)", function(event) {
  if (event.keyCode == 13) {
    event.preventDefault();
  }
});



$('.chips').material_chip();
  $('.chips-initial').material_chip({
    data: [{
      tag: 'Apple',
    }, {
      tag: 'Microsoft',
    }, {
      tag: 'Google',
    }],
  });
$('.chips-placeholder').material_chip({
  placeholder: 'Enter a tag',
  secondaryPlaceholder: '+Tag',
});

var tags = ['test', 'test2', 'test3']


$('.chips').keydown(function(event){
  if (event.keyCode === 13) {
    for (var i = 0; i < tags.length; i++) {

      tags.push($('.chips').material_chip('data')[i].tag);
      $('#hiddenfield').val($('#hiddenfield').val() + tags[i])
    }
    console.log( $('#hiddenfield').val());
  }
})





