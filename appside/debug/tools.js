// for displaying jquery collections in the chrome console as expandable dom trees
// copy not guaranteed to be deep -- manipulating contents might affect dom
function disp(param) {
    // specified as deep copy but apparently isn't.
    let list = $(param).clone();

    let wrapper = document.createElement('div');
    $(wrapper).attr('id', 'fake');
    for (let element of list) {
        // cloning at this level prevents elements from immediately disappearing from dom
        wrapper.appendChild($(element).clone()[0]);
    }
    return wrapper;
}

