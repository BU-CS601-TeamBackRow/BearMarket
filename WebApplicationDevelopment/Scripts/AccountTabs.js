/*
    Controls the MyAccount Tabs to view Portfolio, Profile, 
    and Preferences for each individual user
*/

$('#myTab a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
})