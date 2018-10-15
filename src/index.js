import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

class AnchorPoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      debug: this.props.debug
    };
    this.reRender = false;
    this.disabled = this.props.disabled,
    this.anchor = {
      element: null,
      rect: null,
      diff: Infinity
    }
    
    this.scrollTimeout = null;    
    this.debugStyles = `
img.${this.props.debugAnchorClass} {
  border: 3px solid ${this.props.debugAnchorColor} !important;
}
.${this.props.debugAnchorClass} {
  background: ${this.props.debugAnchorColor} !important;
}
.${this.props.debugLineClass} {
  position: fixed;
  left: 0;
  top: ${this.props.depth}%;
  z-index: ${Math.pow(2,31) - 1};
  width: 100%;
  border: 1px solid ${this.props.debugLineColor} !important;
}`;
    
    // Method bindings
    this.handleScroll = this.handleScroll.bind(this);
    this.findAnchor = this.findAnchor.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }
  
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("scroll", this.handleScroll);
  }
  
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("scroll", this.handleScroll);
  }
  
  handleResize() {
    if(this.disabled) {
      return false;
    }
    
    if(this.anchor.element) {
      // Updates scroll position to maintain a constant distance between the
      // anchor and the top of the viewport
      let top = this.anchor.element.offsetTop - this.anchor.rect.top;
      document.documentElement.scrollTop = document.body.scrollTop = top;
    }
  }
  
  handleScroll() {
    if(this.disabled) {
      return false;
    }
    
    // After scrolling stops, find new anchor
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(this.findAnchor, this.props.delay);
  }
    
  findAnchor() {
    if(this.disabled) {
      return false;
    }
    
    let element = this.getRootElement();
    let targetDepth = this.getTargetDepth();
    let anchor = this.findElementClosestToDepth(element.children, targetDepth);
    
    this.setAnchor(anchor);
  }
  
  getRootElement() {
    return ReactDOM.findDOMNode(this);
  }
  
  getTargetDepth() {
    return this.props.depth/100 * window.innerHeight;
  }
  
  removeHighlighting() {
    if(this.anchor.element) {
      this.anchor.element.classList.remove(this.props.debugAnchorClass);
    }
  }
  
  applyHighlighting() {
    if(this.state.debug && this.anchor.element) {
      this.anchor.element.classList.add(this.props.debugAnchorClass);
    }
  }

  setAnchor(anchor) {    
    if(this.state.debug) {
      console.log("New Anchor:", anchor);
    }
    
    this.removeHighlighting();
    this.anchor = anchor;
    this.applyHighlighting();
  }
  
  isSuitableAnchor(element) {
    let styles = window.getComputedStyle(element);    
    let isNotFixed = styles.getPropertyValue("position") !== "fixed";
    let isNotStyleTag = element.tagName !== "STYLE";
    
    return isNotFixed && isNotStyleTag;
  }
  
  findElementClosestToDepth(elements, targetDepth) {
    let bestAnchor = {
      element: null,
      rect: null,
      diff: Infinity
    };
    
    // Loop through elements to find the one closest to the target
    for(let element of elements) {
      
      if(this.isSuitableAnchor(element)) {
        let rect = element.getBoundingClientRect();
        let isVisible = rect.top >= 0 && rect.top < window.innerHeight;
        let hasChildren = element.children.length > 0;
        
        if(isVisible) {
          let diff = Math.abs(targetDepth - rect.top);
        
          if (diff < bestAnchor.diff) {
            bestAnchor.element = element;
            bestAnchor.rect = rect;
            bestAnchor.diff = diff;
          }
        }
        
        if(hasChildren) {
          let startsAbove = rect.top <= targetDepth;
          let endsBelow = rect.bottom >= targetDepth;
          let spansTarget =  startsAbove && endsBelow
          
          if(spansTarget) {
            let childAnchor = this.findElementClosestToDepth(element.children, targetDepth);

            if(childAnchor.diff <= bestAnchor.diff) {
              bestAnchor = childAnchor;
            }
          }
        }
      }
    }
    return bestAnchor;
  }
  
  // Public Methods
  enableAnchoring() {
    if(this.disabled) {
      this.disabled = false;
      this.findAnchor();
      console.log("React-Anchor-Point: Anchoring Enabled");      
    }
  }
  
  disableAnchoring() {
    if(!this.disabled) {
      this.disabled = true;
      console.log("React-Anchor-Point: Anchoring Disabled");
    }
  }
  
  toggleAnchoring() {
    if(this.disabled) {
      this.enableAnchoring();
    } else {
      this.disableAnchoring();
    }
    
  }
  
  enableDebugging() {
    if(!this.state.debug) {
      this.setState({debug: true});
      console.log("React-Anchor-Point: Debugging Enabled");      
    }
  }
  
  disableDebugging() {
    if(this.state.debug) {
      this.setState({debug: false});
      console.log("React-Anchor-Point: Debugging Disabled");      
    }
  }
  
  toggleDebugging() {
    if(this.state.debug) {
      this.disableDebugging();
    } else {
      this.enableDebugging();
    }
  }
  
  test() {
    console.log("Nothing");
  }
  
  render() {
    if(this.reRender) {
      // new anchor required after render
      setTimeout(this.findAnchor,this.props.delay); 
    } else {
      this.reRender = true;
    }
    
    if(this.state.debug) {
      return (
          <div>
            <style>{this.debugStyles}</style>
            <div className={this.props.debugLineClass}/>
            {this.props.children}
          </div>
      )
    } else {
      return <div>{this.props.children}</div>
    }
  }
};



// Default Props
AnchorPoint.defaultProps = {
  depth: 20,
  delay: 1000,
  debug: false,
  disabled: false,
  debugAnchorColor: "rgb(175, 255, 175)",
  debugAnchorClass: "_react-anchor-point_anchor",
  debugLineColor: "rgba(255, 0, 0, 0.25)",
  debugLineClass: "_react-anchor-point_target"
};



// Prop Validation
AnchorPoint.propTypes = {
  debug: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  debugAnchorColor: PropTypes.string.isRequired,
  debugAnchorClass: PropTypes.string.isRequired,
  debugLineColor: PropTypes.string.isRequired,
  debugLineClass: PropTypes.string.isRequired,
  depth: function(props, propName, componentName) {
    let depth = props[propName];
    
    if(depth === undefined) {
      return new Error("Sorry, you must include a number for depth.");
    }
    
    if(isNaN(depth)) {
      return new Error("Sorry, you must use a number for depth.");
    }
    
    if(depth <= 0 || depth >= 100) {
      return new Error("Sorry, a number between 0 and 100 must be used for depth.");
    }
  },
  delay: function(props, propName, componentName) {
    let delay = props[propName];
    
    if(delay === undefined) {
      return new Error("Sorry, you must include a number for delay.");
    }
    
    if(isNaN(delay)) {
      return new Error("Sorry, you must use a number for delay.");
    }
    
    if(delay <= 100 || delay >= 2000) {
      return new Error("Sorry, a number between 100 and 2000 must be used for delay.");
    }
  }
}


export default AnchorPoint;