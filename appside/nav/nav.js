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
     * @param model - the backend
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
        this.view = FrameFactory.build(this.current_frame);

        // make a new empty div with id nav, not yet in the dom
        let nav_menu = document.createElement('div');
        $(nav_menu).attr('id', 'nav');

        // make a back button
        // TODO: don't make on first slide
        let back = document.createElement('button');
        $(back).text('back');
        $(back).click(function() {
            this.navigate('back')
        }.bind(this));
        nav_menu.appendChild(back);

        // make a next button
        // TODO: let frame help with placement, don't make on last slide
        let next = document.createElement('button');
        $(next).text('next');
        $(next).click(function() {
            this.navigate('next');
        }.bind(this));
        nav_menu.appendChild(next);

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

    /**
     * Navigate to the page specified by slug.
     * Delegates actual navigation to the model, and renders the frame
     * returned by the model.
     *
     * @param slug - string indicating to the model which page is desired
     * @requires - model must know which frame slug refers to
     * @effects - renders the frame specified by slug
     */
    navigate(slug) {
        let input = this.view.get_user_input();
        this.model.update(input)
        // TODO: call has_x_frame to verify this is safe
        this.current_frame = this.model.get_frame(slug);
        this.render();
    }
}


/**
 * Factory to build various kinds of frame objects polymorphically
 */
class FrameFactory {
    /**
     * Take in a frame struct and return the correct type of Frame object,
     * initialized with the given frame struct
     */
    static build(frame) {
        // TODO: more sane identification of frame type (type property)
        if(frame.template === INTRO_FRAME_TEMPLATE) {
            return new IntroFrame(frame);
        } else if(frame.template === STATEMENTS_FRAME_TEMPLATE) {
            // TODO: identify when a different subtype of body frame is needed
            return new StatementsBodyFrame(frame);
        } else if(frame.template === SUMMARY_COUNT_FRAME_TEMPLATE) {
            // TODO: identify when this should be qualifier
            return new SummaryFrameCount(frame);
        } else if(frame.template === LIKERT_FRAME_TEMPLATE) {
            return new LikertFrame(frame);
        } else if(frame.template === SELF_REPORT_FRAME_TEMPLATE) {
            return new SelfReportFrame(frame);
        }
    }
}



