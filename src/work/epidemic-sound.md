---
order: 3
pageTitle: "Epidemic Sound Design System"
description: "A case study of Product Design work done on Epidemic Sounds Design System. By David Bograd."
heading: "Building a design system for millions of creators"
cardTitle: "Soundtracking millions of creators."
tags_display:
  - "Design system"
  - "Epidemic Sound"
accent: "#e5384c"
thumb: es-2x.jpg
cover: esds-heroimage.jpg
coverAlt: "Epidemic Sound design system"
socialImage: es-2x.jpg
intro:
  - "Design at Epidemic Sound had evolved into a mess. It was a broadly acknowledged fact inside the company. The product saw success and evolved fast, and became complicated. It was overly complex and fragmented given its size."
  - "This is the story of how I initiated the Design System project at Epidemic Sound, with the ambition to tidy up, simplify and improve the product. We ended up opening Pandora's box, that led to a company-wide Information Architecture project."
---

### My Role

I started working on the Design System project in August 2018 with the only other Product designer at Epidemic Sound at the time. Shortly after 2 more designers started at Epidemic, and they got involved too. I worked alongside a Product Owner and two Software Developers.

I worked on everything from the grid, the typography to the buttons and the input fields.

{% fig "es-logo.png", "Epidemic Sound", "", "logo" %}

## About Epidemic Sound

### Music you don’t know, you know

Epidemic Sound sells music to online creators, big broadcasters, marketing agencies, and stores (In-store music). Epidemic Sound is the leading provider of music for online creators, with over 1 millions users, and most of the top YouTubers using music from the Epidemic library.

Each month Epidemic Sounds music gets **billions** of streams spread across all the different channels people use their music. You might not know it, but it’s almost certain you’ve heard it.

Over the years Epidemic quickly became a success with TV channels and other broadcasters. They were in a situation with a huge opportunity: a great music library with a unique license. Who else could need that? Turns out, a lot of people could.

## The Challenge

### Simplify and improve the core product

As Epidemic evolved from a small startup, things were built fast to prove them viable. Everyone did their best to shape the product in the same direction, but it ended up messy. Cluttered interfaces with many styles, different frameworks and way too many designs of the same components. (But hey, we had many people using our products!)

The current situation led to internal and external performance issues, made design and development harder, hurt our users, and ultimately hurt our brand. To fix this we started building our Design System, Duplo.

When we started working on Duplo, we had 22 different buttons, 9 different fonts, way too many shades of red, and 13 different text inputs and so on. We needed a digital spring cleaning.

{% fig "buttons-2x.jpg", "Epidemic Sound buttons before the design system", "<em>Epidemic Sound pre-Design system. We had a lot of buttons…</em>", "wide" %}

Here’s a simple breakdown of the problem sets we found:

1. **Performance issues**. Slow responses, slow page loads, fragile application
2. **Design and development issues.** Unorganized code and design cause cognitive load and duplicative work
3. **Impression issues**. Complexity creates a cognitive load for users and hurts our credibility on several levels

## The Approach

### Understanding what we had and figuring out what we needed

The very first thing we did was to take a look inwards: What was the current situation?

We did this by doing a Component Audit: Going through all pages, and note each time we found a new component. This was not only great for understanding the situation, but it was also key for convincing Product Owners of the need for a design system.

{% fig "excel-2x.jpg", "The component audit spreadsheet", "<em>A peek into our Component Audit sheet.</em>", "wide" %}

From here we created the full list of components we needed for the first version of Duplo. Nothing fancy, just listing out all the boxes we need to tick to have a functioning design system. Anything from the basic building blocks like Grid, Typography, and colors to specific components like Buttons and input fields.

We had a great basis to work from now, but there was another challenge: On top of doing the Design System, we were also planning to give the design itself a much-needed overhaul. We were quite sure we couldn’t get the resources to do both at the same time, so it was time to bring in the Product Owners and developers to help plan the project.

## Planning & Scope Definition

### Getting buy-in and setting a plan

To build a successful design system we not only needed the system to work, but we also needed to have “ambassadors” in the different camps that will be using and advocating the Design system. Fortunately, we’d been talking about the project with a handful of people around the product/tech teams, and quickly found both developers and a Product Owner excited to join.

After a handful of discussions we arrived at the 3 steps we had to go through, to get the design where we wanted it:

1. **Duplo v0.5**: Keeping it simple. Mostly to get the situation under control.
2. **Duplo v0.6 - v0.99**: Starting to redesign UI elements
3. **Duplo v1**: Lots of exciting changes!

More detailed plan in the table below.

{% fig "tabel.jpg", "Table outlining the different steps we planned to go through", "<em>Table outlining the different steps we planned to go through.</em>", "wide" %}

{% accent %}
## The Framework

### Going through all elements

Now we had the plan in place, we had the right people on board and was ready to chop away on the design needs the project had.

Since v0.5 mostly was about reducing complexity most of the tasks was deciding on UI components, but we also spend a good amount of time on setting the basic grid, figuring out the sites’ Information Architecture (IA), and setting some basic typography that could cover our needs, until we could give it the upcoming overhaul.

Here's a gallery with everything from glimpses of the early design system to some work-in-progress images.
{% endaccent %}

{% fig "ds-colors.png", "Design system colors", "", "wide" %}

{% fig "ds-typography.png", "Design system typography", "", "wide" %}

{% fig "ds-components.png", "Design system components", "", "wide" %}

{% fig "ds-baseline.png", "Design system baseline grid", "<em>A mixed bag of sections from the Design System</em>", "wide" %}

{% fig "grid-responsiveness-2x.jpg", "Grid responsiveness", "<em>The “most extreme” grids instances, right before and after they break into another interval. We use it to overlay our design files since Sketchs’ grid-feature is so-so.</em>", "wide" %}

{% fig "grid-documentation-2x.jpg", "Grid documentation", "<em>An example of simple but valuable documentation. In this case, the grids behaviour.</em>", "wide" %}

{% fig "whiteboard-sessions-2x.jpg", "Whiteboard sessions", "<em>We had many discussions around whiteboards and walls to wrap our head around the problem at hand.</em>", "wide" %}

## Continuous improvement

### Doing the hard thing: Pausing the project

After working on the project for about 3 months we came to a realisation.

We had gotten deep into the design system and started having a lot of discussion around the core of Epidemic Sounds platform. The current state of the core product was overcomplicated, and to fix it we needed an overhaul of the entire Information Architecture (IA).

We needed to put the design system on hold until the IA project was done. Doing otherwise would lead to double work and wasted time.

The IA project is currently (February 2019) in the works.

### Conclusion

Even though the Design system got put on hold, the project has been great for two reasons:

1. It started discussions that led to a super important project: Redoing the IA. My take away from this is that a project might not always take you where you expect, but it will most likely take you forward.
2. It aligned the design teams’ ideas of Epidemic Sounds look and feel. Our designs are more consistent now and we have a base to ensure it will continue.

In the future, when the Design system will be implemented it will have great value at Epidemic for several reasons. It will make design and development faster, make it easier to maintain our platform and improve both speed and experience.
