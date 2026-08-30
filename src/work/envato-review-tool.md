---
order: 1
pageTitle: "Review Tool for Envato: Case Study"
description: "Designing better review tools for Envato. Millions of items get uploaded to Envato marketplaces every year. This tool makes it efficient to review them."
heading: "Review tool for one of the worlds leading creative marketplaces"
cardTitle: "Review tool for leading creative marketplace."
tags_display:
  - "Review tool"
  - "Envato"
accent: "#0f8a83"
thumb: designqc-thumbnail-2x.jpg
cover: designqc-mainimage-2x.jpg
coverAlt: "The Design QC Review tool for Envato"
socialImage: designqc-thumbnail-2x.jpg
intro:
  - "Over 100 million people visit Envato's marketplaces every year. It's one of the world’s leading marketplaces for selling digital assets – everything from website themes, music tracks to illustrations and photos. You might have heard of them: ThemeForest, AudioJungle and GraphicRiver to name a few."
  - "Big marketplaces need a lot of content. To keep a level of quality the marketplaces have content guidelines. But when getting over 2 million pieces of unique content a year, how do you review them all?"
  - "This is where the review team comes in. They review every single item, to make sure it meets the quality bar, before letting the item being published for sale."
  - "To do this, without hiring hundreds of people, Envato needed a really efficient review tool."
---

{% accent %}
## The quick overview

### Problem

Envato gets thousands of items that need to be reviewed every day. The volume is increasing a lot year-over-year. The existing review tool was slow, ineffective and the reviewers dreaded using it.

To keep up with the growing influx of items, Envato needed to greatly improve review capacity without greatly increasing the cost by hiring new reviewers.

### Solution

We built and shipped a new review tool from scratch in 6 months. The tool is focused on *speed*, and that focus really paid off: **Reviewers now get through 4 times as many items a day.**

Besides the added speed the tool also...

- Increased reviewer job satisfaction, by building the tool for all-day use. The reviewers eyes are not tired after work, as they were previously.
- Made reviewers make fewer mistakes. A built-in undo feature, lets reviewers correct mistakes as they happen.
- Made contributors more happy to provide content, as it is easier for them to have a dialogue with Envato and faster for them to get feedback if their items are accepted.
- Guards Envato for legal risks, by better screening for technical issues.

Below is a prototype of the tool.
{% endaccent %}

{% embed "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQAmnwSZRSRmzbFbDseHnih%2FDesign-QC-Personal-portfolio%3Fnode-id%3D1%253A6625%26viewport%3D-6173%252C-394%252C0.8085748553276062%26scaling%3Dmin-zoom&chrome=DOCUMENTATION", "50", "<em>The tool (and prototype) are not responsive. The reviewers always work from a big desktop.<br>If you're on a mobile, try a desktop computer to play with the prototype.</em>", "wide" %}

### My role

As the main designer on the team, my responsibilities were very wide. They included the whole design process: user research, product direction, prototyping, visual design, user testing, and working with the developers on the implementation.

We built the product with an incredible team, which consisted of a product manager, 6 developers and me. The broader team also included a handful of reviewers and operations managers.

## Approach

### Reviewing, what and why?

I had never reviewed any items. I knew very little about the review process before starting this project. In fact, the whole team didn’t know a lot about reviewing. So we started by learning.

We needed to understand:

1. The problem the review process was solving
2. The people who conduct the review and their workflow

### User interviews to understand the fundamentals

We started by interviewing the review team. We wanted to learn about the current review tools, their biggest challenges, and understand what the different reviewers’ workflow looks like.

We discovered a few insights we had to address:

- The ins and outs of how a review is conducted. The order the reviewer checks different parts of the item and when it would be rejected.
- The current tools had a lot of clutter and extra steps.
- The reviewers’ eyes started to hurt after a long day of work, because they constantly switched between the current very light tool and the dark Adobe CC tools.

### Close cross-team collaboration drove iterative improvements

After getting a fundamental understanding, we started with mockups and early prototypes. Throughout the whole project, we worked closely with the reviewers. Every time we had a new idea (could be a flow or feature), we would bring it to the reviewers. This process helped us quickly narrow down what the tool needed to do, and the best way of doing it.

To lower the communication barrier we set up a Slack channel for reporting bugs, getting feedback on new features, and sharing general ideas on the review tool.

{% fig "design-qc-slack.png", "The Slack channel the team used to collaborate with reviewers", "", "wide" %}

The close collaboration was very successful. Reviewers who have worked at the company for +5 years told us that they've wanted to collaborate for a long time, and this was the first time it was happening.

## Challenges

### Existing challenges

The new tool would fix a handful of different challenges. Both business challenges and issues with the current review tools.

**Slow and therefore not scalable**

Envato's library was growing very fast. Doubling every year, and forecasted to continue that trend. Having an ineffective review tool wasn't an option anymore. We needed to increase review capacity, without just hiring more reviewers. Hiring more reviewers would be too expensive over time.

**Bad reviewer experience**

The reviewers hated the previous tool. They had 3 reasons:

1. The tool was straining their eyes when reviewing items for many hours.
2. It often crashed and wouldn't show the images they needed to review.
3. The tool had no way for the reviewers to provide feedback to contributors. Items that needed a small change were rejected, instead of given feedback, fixed and then approved.

**Contributors deserve better**

Contributors experienced very long wait times, before knowing if their item had been accepted to the marketplace. It was also hard for contributors to get specific feedback and understand why an item might have been rejected.

**Legal problems**

The previous tool had a legal problem as well. The tool didn't allow doing the required technical check. It meant content with a legal risk could be published on Envato's marketplaces. Getting rid of this risk would be a big win.

{% fig "awesomeproofing.jpg", "The previous review tool", "<em>The previous review tool. It's very busy and had a lot of functionality the team did not need.</em>", "wide" %}

## Outcome

### Delivering value with iterations

We ended up delivering the new review tool in three phases:

1. MVP: Core review experience
2. Bulk review
3. Revising a review

**1. MVP focused on the core review experience**

For the first version, we focused on getting the core review experience right. This is the part where a reviewer needs to understand a certain item, see all preview images, and download the file to check everything is in order.

When the reviewer has made up their mind, they need to be able to action that item. There are 4 potential outcomes of a review:

1. Accept: The item will be published
2. Soft reject: Envato provides feedback for a small change, and the author can resubmit the item after they’ve updated it
3. Hard reject: The item is not a good fit for Envato’s marketplace
4. Escalate: The reviewer is unsure about the item and needs an opinion from a senior reviewer.

{% fig "singleview-designqc-2x.jpg", "Reviewing a single item in the new tool", "<em>The main part of the tool - reviewing an item.</em>", "wide" %}

**2. Bulk reviewing to increase speed**

After shipping the MVP version, we instantly started working on the next feature: Bulk reviewing.

Reviewers often only need a quick glance at a preview image, to tell if the item should be rejected. This is where bulk reviewing comes in handy.

Instead of reviewing one by one, the reviewer sees a grid of images. In this view, they can reject batches of items. The reviewer uses this to quickly deal with the clear rejections, so they can focus most of their time on the good and great items.

{% fig "bulkview-designqc-2x.jpg", "Bulk review grid", "<em>Bulk reviewing is used to quickly deal with the clear rejections, so the reviewer can spend most of their time on good and great items.</em>", "wide" %}

{% fig "bulkview2-designqc-2x.jpg", "Providing feedback to creators", "<em>Reviewer can ask creators to do small changes by providing feedback. After the feedback is implemented the item can be published.</em>", "wide" %}

**3. Revising a review**

We're human and we all make mistakes. That's why the next feature we implemented was allowing reviewers to revise a decision they recently made.

It's quite simple. We implemented review history so the reviewers could look through the work they've done. If they see an item they want to change the decision on, they simply click it, and redo the review of that specific item.

{% fig "reviewhistory-designqc-2x.jpg", "Review history", "<em>Review history, for reviewers to check their work and correct mistakes.</em>", "wide" %}

{% fig "revisereview-designqc-2x.jpg", "Revising a past review", "<em>Reviewer can see past review decision in bottom right corner, and revise the review if a mistake was made.</em>", "wide" %}

## Results and next steps

### Conclusion: 4x increase in review speed

We built and shipped the new review tool in 6 months. We achieved our goal and much more:

- **Increased review speed by x4**
- Increased reviewer job satisfaction
- Support reviewers in making less mistakes
- Contributors are happier to provide content
- Guard Envato for legal risks

The next step is to support other item types. The tool is specifically built for Graphic items. We're in the process of building a similar tool for stock video.
