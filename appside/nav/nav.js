"use strict";

/**
   nav.js
   Navigation module for EC app
   @author Leah Perlmutter
*/
 

class Nav {
    /**
     * Construct nav from model.
     * Get first frame of model and render it
     *
     * @public
     *
     */
    constructor(model) {
        this.model = model;
        if(!this.model.has_next_frame()) {
            throw new RangeError('Model does not have any frames');
        }
        this.current_frame = model.get_frame('next');
        this.render();
    }

    /**
     * Render nav buttons and current frame into the DOM
     *
     * @private
     *
     * @require - DOM must have a div whose ID is 'nav'
     * @effects - Does not preserve former content of <div id="nav">.
     *    Renders the navigation buttons into that div.
     */
    render() {
        this.view = this.current_frame;
        this.set_legal_actions();

        // make a new empty div with id nav, not yet in the dom
        let nav_menu = document.createElement('div');
        $(nav_menu).attr('id', 'nav');
        $(nav_menu).attr('class', 'text-center align-bottom flex-grow-1 nav-btn');

        // make a back button
        if(this.back_ok) {
            let back = document.createElement('button');
            $(back).text('back');
            if (this.view.is_app)
                $(back).attr('class', 'btn btn-info mr-2');
            else
                $(back).attr('class', 'btn btn-primary mr-2');
            $(back).click(function() {
                this.navigate('back')
            }.bind(this));
            nav_menu.appendChild(back);
        }

        // make a next button
        // TODO: let frame help with placement
        if(this.fwd_ok) {
            let next = document.createElement('button');
            $(next).text('next');
            if (this.view.is_app)
                $(next).attr('class', 'btn btn-info mr-2');
            else
                $(next).attr('class', 'btn btn-primary mr-2');
            $(next).addClass('nav_next_button');
            $(next).click(function() {
                this.navigate('next');
            }.bind(this));
            nav_menu.appendChild(next);
        }

        // make an exit button
        // TODO: implement exit navigation.
        // let exit = document.createElement('button');
        // $(exit).text('exit');
        // $(exit).click(function() {
        //     this.navigate('exit');
        // }.bind(this));
        // nav_menu.appendChild(exit);

        let old_nav_menu = $('#nav')[0];
        old_nav_menu.replaceWith(nav_menu);

        this.view.render();
    }

    navigate(slug) {
        let input = this.view.get_user_input();
        this.model.update(input)
        // TODO: call has_x_frame to verify this is safe
        this.current_frame = this.model.get_frame(slug);
        this.render();
    }

    /**
     * Query model to set internal fields saying which nav actions are legal
     * @modifies - this
     */
    set_legal_actions() {
        this.fwd_ok = this.model.has_next_frame();
        this.back_ok = this.model.has_prev_frame();
        this.fwd_reversible = this.model.is_next_reversible();
    }
}
