# FUTURE: Website Content (docs/CONTENT.md)

## Notes for the coding agent (read first)

1. Every `[FILL: ...]` is a fact the founder has not supplied yet. Never invent a replacement.
2. Add a build check that **fails the production build** if the text `[FILL` appears anywhere in rendered pages, JSON data or metadata. During development, show `[FILL]` items in a visible highlight colour so gaps are obvious.
3. If a section depends on data that is missing (for example no team members yet), hide that section rather than showing empty boxes, unless this file says otherwise.
4. Prices come from `docs/robots.json`. A `null` price is shown as **"Price on request"**. Never show 0 or NaN.
5. Currency is INR. Format as Indian numbering, for example `₹1,25,000`.
6. Routes: `/`, `/robots`, `/robots/[slug]`, `/institutions`, `/experience`, `/team`, `/about`, `/contact`, `/order/success`, `/privacy`, `/terms`, `/order-terms`, and a 404 page.
7. `/order/success` and the 404 page must carry `noindex`.
8. The domain is [FILL: your domain, e.g. yourdomain.com]. Use it for canonical URLs and the sitemap.
9. Voice: confident, warm, simple English. Short sentences. No hype words, no jargon, no claims we cannot prove.

---

## Global elements

**Navigation labels:** Home, Robots, Institutions, Experience, Team, About, Contact
**Navigation button (right side):** Talk to us (goes to /contact)
**Logo:** [FILL: logo file or confirm text-only wordmark "FUTURE"]

**Footer**
- Tagline: The future you imagined as a child. Built today.
- Column "Explore": Robots, Institutions, Experience, Team, About, Contact
- Column "Legal": Privacy Policy, Terms of Use, Order Terms
- Column "Reach us": [FILL: hello@ email address], [FILL: phone number(s)], [FILL: postal address]
- Registration line: FUTURE is an Udyam-registered MSME. Udyam number: [FILL: Udyam registration number, format UDYAM-XX-00-0000000].
- Copyright line: © {current year} FUTURE. All rights reserved.

---

## 1. Home (`/`)

**SEO title:** FUTURE | Robots for Companies and Institutions in India
**Meta description:** FUTURE designs and sells robots to companies and institutions across India. Customise a robot for your office, or build one with your students.

**Headline:** The future you imagined as a child. Built today.
**Subheadline:** FUTURE designs robots for companies and institutions in India. Choose a robot, shape it for your space, or build one with your students.
**Buttons:** Explore robots (primary, goes to /robots) | Talk to our team (secondary, goes to /contact)

### Section: Mission
**Heading:** Robots in every corner of the world.
**Text:** Many of us grew up picturing a future with robots that could help, build and explore. FUTURE exists to bring that picture to life. We start with offices and classrooms in India, and we take it one robot at a time.

### Section: Who we build for
**Heading:** Made for the places where people work and learn.

**Card 1 title:** For companies
**Card 1 text:** Pick a robot type, then shape it for your office or headquarters. You choose what it does. We build it around your space.
**Card 1 button:** See robots (goes to /robots)

**Card 2 title:** For institutions: buy
**Card 2 text:** Choose a ready robot for your school, college or university, and have it delivered.
**Card 2 button:** See ready robots (goes to /robots)

**Card 3 title:** For institutions: build
**Card 3 text:** Invite our mentor team to your campus. Your students build the robot themselves. We bring the materials and the guidance.
**Card 3 button:** Build on your campus (goes to /institutions)

### Section: How it works
**Heading:** From idea to robot, in four steps.
1. **Choose a robot.** Browse our robots and open the one that fits your need.
2. **Shape it.** Select the operations you want it to perform. You see an estimated price as you go.
3. **Send your order request.** Tell us who you are and where the robot will be used.
4. **We visit and confirm.** Our team visits you, talks through the details and confirms the final price.

**Note under steps:** An order on this website is a request, not a final sale.

### Section: Featured robots
**Heading:** Our robots
**Text:** Show the first three robots from `docs/robots.json` as cards (image, name, tagline). Hide this section if there are no robots.
**Button:** View all robots (goes to /robots)

### Section: Registration
**Heading:** Registered, and open about it.
**Text:** FUTURE is an Udyam-registered MSME. Our Udyam number is [FILL: Udyam registration number, format UDYAM-XX-00-0000000]. Read what this registration means, and what it does not, on our About page.
**Button:** See our registration (goes to /about#trust)

### Section: Closing call to action
**Heading:** Tell us about your space.
**Text:** Whether it is an office floor or a classroom, we would like to hear what you want a robot to do there.
**Buttons:** Contact us (primary) | Explore robots (secondary)

---

## 2. Robots (`/robots` and `/robots/[slug]`)

**SEO title:** Robots for Offices, Schools and Colleges | FUTURE
**Meta description:** Browse FUTURE's robots. Pick one, choose what it does and send an order request. Companies can customise; institutions can buy or build.

**Headline:** Choose your robot.
**Subheadline:** Open any robot to see what it does, shape it to your needs and see an estimated price.

### Grid
- Each card shows: image, robot name, tagline, button **View robot**.
- Clicking a card opens the detail page with the card-to-detail expansion described in `docs/DESIGN.md`.
- **Empty state heading:** Our robots are being prepared.
- **Empty state text:** Tell us what you need and we will get in touch.
- **Empty state button:** Contact us

### Robot detail page (one per robot, data from `docs/robots.json`)

**SEO title pattern:** {robot name} | FUTURE Robots (keep under 60 characters; shorten the name if needed)
**Meta description pattern:** {robot tagline}. See what it can do, customise it and send an order request to FUTURE. (keep under 155 characters)

**Back link:** All robots

**Section: Overview**
- Heading: {robot name}
- Subheading: {robot tagline}
- Text: {robot description}

**Section: Specifications**
- Heading: Specifications
- Text: list from `specs`.

**Section: What it can do**
- Heading: What it can do
- Text: Select the operations you want. Each one shows what it adds to the estimated price.
- Each operation row: checkbox, label, description, and price text. Price text is `+ ₹{priceAdd} {unit}` or **Price on request** if `priceAdd` is null.

**Section: How would you like to order?**
- Heading: How would you like to order?
- Question 1: Who is ordering?
  - Option **A company**
  - Option **An institution**
- If **A company**:
  - Panel title: Customised for your space
  - Panel text: We customise this robot for your office or headquarters. Tell us about your space in the order form below, and our team will visit to plan the details.
- If **An institution**, show two choice cards:
  - **Buy a ready robot.** A finished robot, delivered to your institution.
  - **Build it at your campus.** Our mentors visit your institution. Your students build the robot, with all materials and guidance from us.
- If **Build it at your campus**, show inputs:
  - Label: Number of students. Help text: Minimum {minStudents} students.
  - Label: Number of mentor days. Help text: [FILL: how mentor days are decided and typical range]

**Section: Estimated price**
- Heading: Estimated price
- Line items: robot or kit, selected operations, mentor days, student materials (only the ones that apply).
- Total label: Estimated total
- Note (always visible): This is an estimate. We confirm the final price after our team visits you.
- If any needed price is null: **Price on request.** Send your request and we will share a quote after our visit.

**Section: Order form**
- Heading: Send your order request
- Intro: This is a request, not a final sale. Nothing is charged now.
- Fields: Your name | Organisation name | Your role | Email | Phone | City | Address where the robot will be used | Anything else we should know (optional)
- Consent checkbox: I agree to the Privacy Policy and Order Terms. I understand this is a request, not a final sale.
- Button: Send order request
- Sending state: Sending...
- Error text: We could not send your request. Please try again, or write to [FILL: orders@ email address].
- Field errors: "Please enter your name." / "Please enter a valid email." / "Please enter a valid phone number." / "Please tick the box to continue."

---

## 3. Institutions (`/institutions`)

**SEO title:** Robotics for Schools and Colleges | FUTURE
**Meta description:** Buy a ready robot, or invite FUTURE's mentors to your campus so your students build one. We bring the materials and the guidance.

**Headline:** Let your students build the robot.
**Subheadline:** Bring robots to your campus in the way that suits you. Buy one that is ready to use, or have our mentors guide your students as they build it.
**Buttons:** Choose a robot (primary, goes to /robots) | Talk to our team (secondary, goes to /contact)

### Section: Two ways to bring robots to your campus
**Option 1 title:** Buy a ready robot
**Option 1 text:** Pick a robot, choose the operations you need and send an order request. We deliver a finished robot to your institution.
**Option 2 title:** Build it with our mentors
**Option 2 text:** Our mentor team comes to your campus. Your students build the robot with their own hands. All materials and guidance come from us.

### Section: How a build visit works
**Heading:** How a build visit works
1. **Choose a robot.** Open a robot and select "Build it at your campus".
2. **Tell us your numbers.** Enter how many students will take part and how many mentor days you want.
3. **We visit you.** Our team looks at your space and your needs, then confirms the plan and the final price.
4. **Students build.** Our mentors arrive with the materials and guide students through each step.

### Section: Who brings what
**We bring:** All materials for the build. Our mentor team. Step-by-step guidance for your students.
**You bring:** [FILL: what an institution must provide for a build visit, e.g. room, power supply, students, number of days]

### Section: What students learn
**Heading:** What students take away
**Text:** [FILL: skills students will practise during a build, in plain words]

### Section: Questions
**Heading:** Questions institutions ask
- **Do students need robotics experience?** [FILL: whether prior experience is needed, and the age or class levels you support]
- **Who provides the materials?** We do. All materials and guidance for the build come from FUTURE.
- **Is the price fixed when I send my request?** No. The price on the website is an estimate. We confirm the final price after our team visits your institution.
- **Which cities do you visit?** [FILL: cities or regions your team can visit]
- **Who owns the robot at the end?** [FILL: ownership of the finished robot and its software]

### Closing call to action
**Heading:** Ready to bring robots to your campus?
**Buttons:** Choose a robot | Talk to our team

---

## 4. Experience (`/experience`)

**SEO title:** Our Work and Experience | FUTURE
**Meta description:** See the robots, demonstrations and projects behind FUTURE. Only work we can show is listed on this page.

**Headline:** What we have built so far.
**Subheadline:** Real projects and real demonstrations. Only work we can show is listed here.

### Section: Projects and demonstrations
**Heading:** Projects and demonstrations
**Entry template (repeat for each real item, newest first):**
- Title: [FILL: project or event title]
- Year: [FILL: year]
- What it was and what we did: [FILL: what it was, and your role in it]
- Link or photo: [FILL: link, photo or video for this item]

### Section: Competitions, workshops and club work
**Heading:** Competitions, workshops and club work
**Text:** Use the same entry template. Include only items you can prove with a photo, link, certificate or witness. Add the club and team context only where it is true, for example: [FILL: optional line about the VIPS-TC Robotics Club work you want shown].

### Section: Clients
Use **Version A** only if FUTURE has real clients who have agreed in writing to be named. Otherwise use **Version B**.

**Version A**
- Heading: Who we have worked with
- Entry: [FILL: client name, used only with written permission] and [FILL: what we delivered for them]

**Version B (no clients yet)**
- Heading: Our first client stories are still to come.
- Text: FUTURE is a new company. Until we have client stories to share, you can see what we have built and shown above. If you would like to be one of our first clients, we would like to hear from you.
- Button: Start a conversation (goes to /contact)

---

## 5. Team (`/team`)

**SEO title:** Meet the Team | FUTURE
**Meta description:** Meet Uday Sahu, founder and CEO of FUTURE, and the team building robots for companies and institutions in India.

**Headline:** The people behind FUTURE.
**Subheadline:** The team that designs, builds and teaches.

### Section: Founder
- Name: Uday Sahu
- Role: Founder and CEO
- Photo: [FILL: founder photo file]
- Short bio: Uday studies B.Tech in VLSI (Electrical Engineering) at VIPS-TC, GGSIPU. He is the Team Leader of the VIPS-TC Robotics Club. He works on robotics, embedded systems and AI-driven hardware.
- His story: [FILL: founder story, 3 to 5 sentences in your own words]
- Achievements: [FILL: founder achievements, only ones you can prove]
- Button: Connect on LinkedIn (opens [FILL: LinkedIn URL] in a new tab)

### Section: Team members
**Heading:** The team
**Entry template (repeat per person, founder first):**
- Name: [FILL: team member name]
- Role: [FILL: team member role]
- One-line bio: [FILL: team member one-line bio]
- Photo: [FILL: team member photo file]

### Closing line
**Text:** Want to build robots with us? [FILL: say whether you are hiring or taking mentors, or delete this line]

---

## 6. About and Trust (`/about`)

**SEO title:** About FUTURE and Our MSME Registration
**Meta description:** Learn why we started FUTURE, and see our Udyam MSME registration, what it means and how you can verify it.

**Headline:** Why FUTURE exists.
**Subheadline:** A company built on a childhood idea of the future.

### Section: Our story
**Text:** FUTURE starts from a simple idea: the robots we imagined as children should exist, and they should be within reach of the people who want them. [FILL: founder story or company origin, in your own words]

### Section: Our mission
**Text:** Robots in every corner of the world. We want to recreate the future we imagined as children, one robot at a time.

### Section: How we work
**Heading:** Three promises
- **Simple first.** We explain what a robot does in plain words.
- **Honest about price.** The price on this site is an estimate. We confirm the final price after we visit you.
- **Learn by building.** For institutions, we also teach. Our mentors guide students as they build.

### Section: Trust (`/about#trust`)
**Heading:** Our registration

**Details table**
| Item | Value |
|---|---|
| Business name | FUTURE |
| Registration | Udyam registration (MSME) |
| Udyam number | [FILL: Udyam registration number, format UDYAM-XX-00-0000000] |
| Legal structure | [FILL: legal structure, e.g. proprietorship, partnership or LLP] |
| GSTIN | [FILL: GSTIN, or remove this row if none] |
| Registered address | [FILL: registered business address] |

**What this means (plain words):**
FUTURE is registered as a Micro, Small and Medium Enterprise (MSME) on the Government of India's Udyam portal. This is a registration of our business with the government. It is not the same as incorporating a company, and FUTURE is not a Private Limited company. The registration also does not certify the quality or safety of our robots.

**How to verify:** You can check an Udyam number on the official Udyam portal (udyamregistration.gov.in).
**Buttons:** View our Udyam certificate (opens [FILL: Udyam certificate file, with personal details hidden]) | Verify on the Udyam portal (opens udyamregistration.gov.in)

### Section: Safety and standards
**Heading:** Safety and standards
**Text:** [FILL: any safety tests or certifications you can prove, or write exactly what is true, for example that none have been obtained yet]

### Closing call to action
**Heading:** Have a question about us?
**Button:** Contact us

---

## 7. Contact (`/contact`)

**SEO title:** Contact FUTURE | Talk to Our Robotics Team
**Meta description:** Contact FUTURE about robots for your company, school, college or university. Send a message, call or write to us.

**Headline:** Let's talk about your robot.
**Subheadline:** Tell us about your office or campus. We will reply [FILL: reply time promise, e.g. within 2 working days].

### Section: Contact form
- Fields: Your name | Organisation | I am contacting you as (A company / An institution / Something else) | Email | Phone | Your message
- Consent checkbox: I agree to the Privacy Policy and I am happy for FUTURE to contact me about this message.
- Button: Send message
- Success text: Thank you. Your message has reached our team.
- Error text: We could not send your message. Please try again, or write to [FILL: hello@ email address].

### Section: Reach us directly
- General questions: [FILL: hello@ email address]
- Orders: [FILL: orders@ email address]
- Support: [FILL: support@ email address]
- Phone: [FILL: phone number(s)]
- Address: [FILL: postal address]
- Working hours: [FILL: working hours]
- Map: [FILL: map link or embed, optional]

**Note:** The same contact block appears at the bottom of every page (footer).

---

## 8. Order success (`/order/success`) (noindex)

**SEO title:** Order Request Received | FUTURE
**Meta description:** Your order request has reached FUTURE. Our team will contact you to plan a visit and confirm the final price.

**Headline:** We have your request.
**Subheadline:** Thank you. Your order request has been sent to our team.

### Section: Your request
Show: Reference number | Robot | How you are ordering (company, buy, or build) | Selected operations | Estimated price (or "Price on request").

### Section: What happens next
1. **You get a confirmation.** We send a confirmation to the email you gave.
2. **We contact you.** Our team will reach out [FILL: reply time promise, e.g. within 2 working days].
3. **We visit.** We look at your space and talk through the details.
4. **We confirm the price.** We share the final price and terms in writing before anything is final.

**Reminder box:** This is a request, not a final sale. Nothing is charged until you accept our written confirmation.

**Buttons:** Back to home | Explore more robots | Contact us

### Confirmation email (template)
- Subject: We have received your order request ({reference})
- Body: Hello {name}, thank you for your order request for {robot}. This is a request, not a final sale. Our team will contact you [FILL: reply time promise, e.g. within 2 working days] to plan a visit. We will confirm the final price after the visit. Your reference is {reference}. If you need to reach us, write to [FILL: orders@ email address]. The FUTURE team

---

## 9. 404 (noindex)

**SEO title:** Page Not Found | FUTURE
**Meta description:** This page could not be found. Go back to the FUTURE home page or see our robots.

**Headline:** This page is not here.
**Subheadline:** The link may be old, or the address may have a typing mistake.
**Buttons:** Go to home (primary) | See our robots | Contact us
