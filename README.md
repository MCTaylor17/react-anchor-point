<h1>&lt;AnchorPoint/&gt;<sup> Beta</sup></h1>

AnchorPoint is a simple react component that will **help your users stay oriented** with the content on your page.

## The Problem
Lets face it, like everyone, your users are busy people.  They likely have several browser tabs open and switch between them frequently.  If they leave your tab, they might not come back for a while.  When they return, there's a good chance the browser window won't be the same size it was when they left.  

In the age of Responsive Web Design (RWD), **a resized browser means shifting content**.  The amount of shift will depend on a number of factors including:

* The type and volume of content on the page
* How your web app optimizes screen real-estate
* The users position on the page (content shift is amplified near the bottom)

## The Solution
AnchorPoint's solution is simple:

1. Find an element that is visible on the page
2. Ensure that element remains visible when resized

The effect is actually **a pleasant user experience** and a refreshing change from how we've always experienced the internet up until now.  You may even find yourself playing with the window size just to watch it in action.

## Why Care?
### User Retention
On the internet, **attention is a scarce resource**.  Any time that your users have to spend re-orienting themselves is potential for a missed opportunity.  AnchorPoint helps your users re-engage with your content immediately.

### Accessibility
A minor inconvenience for one user can be a **major frustration** for another.  Anything that causes a user to becomee disoriented on the web is an accessibility concern.  For example, after showing a page with significant content shift to a friend with multiple concussions, he described an experience of dizziness so severe he had to look away.  

Cognitive disabilities can manifest in any number of ways that are hard for others to understand.  While not required by WCAG 2.0 or 508 Compliance, it's good practice to **aspire towards the best possible user experience**.

### Frontend Development
Let's face it, **you have to resize the page far more than any user**.  If it's your job to ensure that things look great no-matter the screen size, AnchorPoint can make your life a little easier by avoiding the typical resize-scroll-resize-scroll workflow required to implement RWD features.

## Usage
Install via npm as usual:

```
npm i -S react-anchor-point
```

Once installed, import the component into your project and wrap it around the main part of your app.  AnchorPoint will only search decendents allowing you to exclude areas of your app that wouldn't make sense to anchor onto.


```js
import React from "react";
import AnchorPoint from "react-anchor-point";
import { Header, Aside, Main } from "./your-components";

const App = () => {
  return (
    <div>
      <Header/>
      <Aside/>
      <AnchorPoint>
        <Main/>
      </AnchorPoint>
    </div>
  )
}
```

### Customize
There are two primary configuration options that you might want to adjust:


1. `delay="{number}"` (accepts `100` through `2000`, default `1000`): The number of milliseconds to wait after scrolling before searching for a new anchor.  AnchorPoint "debounces" the search to avoid unecessary function calls from rapidly firing "scroll" events.  Too small and you can suffer a performance hit.  Too large and an anchor may not be found before resizing.

2. `depth="{number}"` (accepts `0` through `100`,default `20`): The percent from the top of the viewport where you would like AnchorPoint to look find an anchor after scrolling has stopped.

For example `<AnchorPoint delay="1500" depth="50">` would wait 1.5 seconds before searching for an anchor around* the midpoint of the screen.

<small>*AnchorPoint works by looking for an element whose top is closest to the depth, above or below</small>


### Debugging
If you are having difficulties with AnchorPoint or just want a better way to watch it in action, simply add the `debug` property like so:

```
<AnchorPoint debug>
```

This will apply add a visual line for the depth and highlight anchors as they're found.

If you need better contrast or the class names are creating style conflicts, you can customize the following properties:

* `debugAnchorClass="{string}"`
* `debugAnchorColor="{CSS color string}"`
* `debugLineClass="{string}"`
* `debugLineColor="{CSS color string}"`

You can also disable AnchorPoint by adding the `disabled` property.

There are also a few methods available for dynamically switching the state, including: 

* `AnchorPoint.enableAnchoring()`
* `AnchorPoint.disableAnchoring()`
* `AnchorPoint.toggleAnchoring()`
* `AnchorPoint.enableDebugging()`
* `AnchorPoint.disableDebugging()`
* `AnchorPoint.toggleDebugging()`

You can access these methods by exposing them through the `ref` attribute like so:

```
<AnchorPoint ref={(reactAnchor) => { window.reactAnchor = reactAnchor}}>
  <Main/>
</AnchorPoint>
<button onClick={() => reactAnchor.toggleDebugging()}>Toggle Debugging</button>
```

Once exposed, you can also call the methods directly from the console.