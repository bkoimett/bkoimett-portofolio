/* Case notes for every project record.

   Authored as structured data, never as a markdown string: paragraphs and
   lists are separate fields so the page can lay them out as a case file and
   an editor never has to guess whether a line is a heading or a sentence.

   Console-authored copy (the admin drawer takes free text) still wins when it
   has been written by a person. The importer's own filler does not, which is
   what `isConsoleCopy` is for.
*/

export const caseNotes = {
  'carefacility-platform': {
    scope: 'Built end to end',
    standfirst:
      'Running a rehabilitation facility means knowing, at any moment, who lives there, who sponsors them, and what is owed. This puts the whole of that on one screen and keeps the balance right as money moves.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Resident records lived in one place, sponsorship in another, and payment follow-up in a notebook. Balances were worked out by hand at the end of the month, so by the time a debt was visible it was already months old. Nobody could answer where collections stood without an afternoon in a spreadsheet.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Residents, sponsors and their relationships in one register',
          'Payments recorded against a sponsor, not against a person',
          'Balances calculated on the server so the screen cannot drift from the ledger',
          'Scheduled alerts when a payment lapses, sent once and recorded',
          'Revenue analytics over the same records, not a second set of numbers',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'The balance is computed on write rather than stored, so there is one number and one place it comes from. Alerts carry a dedupe key per lapse, which is what stops a resident being chased by the same message every morning.',
        ],
      },
    ],
  },

  landledger: {
    scope: 'Contract and client',
    standfirst:
      'A title deed is a piece of paper, and nothing stops the same plot being sold twice because the register is slow to check. This puts a fingerprint of each deed on a public chain so a buyer can verify in seconds.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Confirming ownership in Kenya means a physical search, a county office, and days of waiting. By the time a duplicate sale surfaces, the money has moved and the remedy is legal rather than technical. The register is the product; if it is slow, nobody trusts it.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Hashes the contents of a deed and anchors that hash on chain',
          'Verifies a deed by reference number without any account',
          'Shows the ownership history recorded against a parcel',
          'Keeps a read model for search, rebuilt from the chain state',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'Solana was chosen for cost per record, not throughput: anchoring has to be cheap enough that a small registry can afford to write every deed. The chain is the register of record and the database is a cache of it, so a stale cache is a rebuild rather than a dispute. The client and the contract are both TypeScript so a change to the interface breaks the build instead of a deployment.',
        ],
      },
    ],
  },

  'the-serenity-place': {
    scope: 'Full stack, public and internal',
    standfirst:
      'A rehabilitation centre runs on records, and the public site has a completely different audience from the staff who use those records. This is both, on one codebase, with the line between them drawn in the routes rather than in a template.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Most facilities of this kind have a brochure for the public and a filing cabinet for the staff, and the two drift apart. Programmes change, staff need somewhere to write down what happened, and none of it is shared. The problem is not the website; it is having two versions of the truth.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Landing pages that state what the centre does and who it is for',
          'A blog and gallery driven from the console rather than from files',
          'Resident and programme records behind authentication',
          'One user model for staff and for the public site',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'Public content and internal records are separated at the route layer and again at the auth layer, so a new page cannot accidentally publish a resident record. The whole thing is one MERN codebase because a small team has to be able to change the programmes page and the intake form in the same afternoon.',
        ],
      },
    ],
  },

  'kijiji-corporate-cuisine': {
    scope: 'Rebuild and content workflow',
    standfirst:
      'A food blog that was slow to load and had no way to publish without editing files. This is the same site with the weight taken out and a console in front of it.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'The original site served full-size images and did work on the server that belonged in the browser, so pages took seconds to settle. Publishing meant a commit, which in practice meant posts stopped going up.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Posts and recipes created from an admin dashboard',
          'Images resized and served from storage instead of bundled',
          'Server-rendered pages for anything that must render without JavaScript',
          'A React layer only where the interaction earns it',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'Posts are stored in one documented shape, so the dashboard can offer a preview of exactly what will publish before anything is saved. EJS stayed for the pages that need to arrive complete on a slow connection, with React added around the parts that are genuinely interactive rather than across the whole site.',
        ],
      },
    ],
  },

  'task-mix': {
    scope: 'Hackathon prototype',
    standfirst:
      'Short paid work is arranged on paper, and the proof of what you did does not travel with you. This is a local-first prototype where the record of completed work is created on the device and verified later.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'For unemployed youth taking small jobs, the missing part is not the work, it is the record. A badge that exists only as paper loses its value the moment the paper is lost, and a person cannot show a skill level they have never had measured.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Small tasks posted locally, with payment attached to each one',
          'Work logged and signed on the device as it happens',
          'Verifiable badges that can be checked once there is a connection',
          'No account required to take the first task',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'Local first, because the people it is for are the least likely to have signal; the app has to be useful with the radio off. The badge is signed data held by the worker rather than a row on a server, so a lost connection does not lose the evidence.',
        ],
      },
    ],
  },

  'collaborative-markdown-editor': {
    scope: 'Foundational build',
    standfirst:
      'Two people editing one document over a chat window overwrite each other. This is the version where the document merges itself and neither person has to win the race.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Locking a document is the usual answer and it is the wrong shape for two people: one of them waits, and the lock has to be held across a network that can drop. A conflict-free approach removes the lock entirely.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Concurrent edits to a shared markdown document without locking',
          'Presence, so each editor can see who else is in the document',
          'A change feed so a late joiner catches up instead of starting over',
          'Containerised so the stack runs the same on a laptop and on a server',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'The CRDT is the core decision: merges become deterministic and no edit is rejected, which is what makes it safe to leave two people in one document. Redis carries presence and the change feed because both are short-lived and both are read constantly, which is not what a relational store is good at. Go on the server because the workload is many connections waiting on each other, and Docker because a three-service stack that only runs on one machine is not a stack.',
        ],
      },
    ],
  },

  'e-commerce': {
    scope: 'Storefront and checkout',
    standfirst:
      'A small electronics retailer taking orders by phone and applying discounts by hand. This is the storefront, the promotions engine and a checkout that does not care which payment provider is plugged in.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Discounts applied by a person are discounts that are applied wrongly. The stock list changes daily, the customers want to pay the way they already pay, and staff need to change a promotion without waiting for a developer.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Catalogue with stock tracked against each product',
          'A promotions engine staff can operate themselves',
          'Checkout through M-Pesa or card',
          'An admin dashboard over orders, stock and promotions',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'The payment provider sits behind a single interface, so M-Pesa and card are swappable and adding a third is a new adapter rather than a checkout rewrite. Promotions are rows in a table instead of code, which is the difference between a staff member changing a discount and opening a ticket.',
        ],
      },
    ],
  },

  flasnotes: {
    scope: 'Co-developed, front end',
    standfirst:
      'A study assistant that writes the flashcards, then adapts to how badly they were answered. I built the front end of it with a Go service behind it.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'A deck you write yourself is a deck you will not finish. Flashcards are only worth their cost if writing them is faster than revising the material, and most of the time it is not.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Flashcards generated from source material rather than typed by hand',
          'An adaptive review order, so weak cards come back sooner',
          'A React front end over a Go service',
          'Progress kept per deck, so a session can be resumed',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'Generation and review are separated. What a card looks like belongs to the service; the front end renders a card and records a result. That split is what let this part of the product move without a redesign.',
        ],
      },
    ],
  },

  agrisync: {
    scope: 'Offline-first PWA',
    standfirst:
      'Farming advice for regions where the connection is the exception. Learning modules, reference data and FAO figures all work with the radio off.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'The people who most need planting and pest advice are the least likely to have signal when they need it, and a search box that fails is the same as no advice at all. FAO reference data is published, but publishing it is not the same as delivering it.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Learning modules that complete offline',
          'FAO reference data bundled with the app',
          'A caching layer that refreshes when a connection appears',
          'Installable to the home screen and usable once installed',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'The reference data ships with the app rather than being fetched, so a first-time user in a valley gets the same material as one standing beside a tower. Every screen assumes it is offline and treats the network as a synchronisation event rather than a prerequisite.',
        ],
      },
    ],
  },

  'terra-node': {
    scope: 'Prototype',
    standfirst:
      'Restoring land is cheap to promise and hard to prove. This makes a restoration parcel into something a claim can be traced to, instead of a number nobody can inspect.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'The market for carbon offsets is built on claims, and a claim is only worth what its evidence is worth. A tree count from a survey report is not the same thing as a parcel you can point at, and the difference matters to anyone paying for the offset.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Restoration parcels recorded as the thing being tokenised',
          'Evidence attached to the parcel rather than to the claim',
          'Accounting per parcel, so a claim can be walked back to the ground it covers',
          'A view of the portfolio aimed at people who will never read a survey',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'The token represents a specific parcel of land, not an abstract unit of offset, because that is the only version of this that survives someone asking where the carbon came from. The interface therefore treats the parcel as the primary object and the token as an attribute of it, which is the opposite of how most token projects are built.',
        ],
      },
    ],
  },

  detecto: {
    scope: 'Python service, React client',
    standfirst:
      'Counting the people in a room by hand is slow, and the tally is not repeatable. This counts them with a YOLOv8 model and draws the boxes, so a person can check the machine instead of trusting a number.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'A manual headcount is quick once and unrepeatable. Nobody can tell whether a difference between two counts is a change in the room or a change in the person counting, and that is exactly the question a headcount is usually being asked.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Photographs uploaded and analysed for people',
          'Boxes drawn over the image with the count alongside',
          'Past uploads kept, each with its result and its timing',
          'Throughput shown, so a slow model is visible rather than mysterious',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'Inference lives in a FastAPI service so the browser never waits on the model and a slow frame does not become a frozen page. Every upload is stored with its count and its duration, so accuracy and speed can be compared across the archive instead of argued about. The boxes stay on the photograph on purpose: an unexplained number is not a result.',
        ],
      },
    ],
  },

  'bloom-watchers': {
    scope: 'Hackathon build',
    standfirst:
      'A NASA Space Apps challenge entry. The repository holds the front end, which is the part that turns a public data feed into something a non-specialist can read in ten seconds.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'The data is public and the audience is not technical. A chart that is correct but takes a paragraph to explain has failed, and during a hackathon there is no time to write the paragraph, so the interface has to carry the meaning on its own.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'A front end over a public space and environmental data feed',
          'Imagery and figures presented side by side rather than in separate pages',
          'A layout that survives being opened on a phone in poor signal',
          'Enough structure to keep building on after the weekend',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'The feed is read once and cached, because a challenge demo that stalls on a live request is a demo that does not happen. Everything shown is labelled with where it came from and when, so a viewer can tell a data problem from a rendering problem.',
        ],
      },
    ],
  },

  'opencode-ntfy-approve': {
    scope: 'OpenCode plugin',
    standfirst:
      'An agent that can run commands asks for permission from wherever you are sitting. This sends that question to your phone, with the answer in the notification.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'The permission prompt is the real constraint on agent work. You start a long task, you leave the desk, and the task sits there waiting for a human who is not in front of the machine. Sending a link does not help; the link is still a page you have to go and load.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Tool permission requests forwarded to an ntfy topic',
          'Allow and reject as buttons in the notification itself',
          'A reply that reaches the running session without the terminal',
          'No state of its own between request and reply',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'The decision is part of the message rather than a link to a page, because the whole feature is worthless if responding takes more than one tap. The plugin holds nothing between the request and the reply, so a dropped push fails visibly instead of leaving a session waiting on a decision that was never recorded.',
        ],
      },
    ],
  },

  sigyard: {
    scope: 'Self-hosted pipeline',
    standfirst:
      'Watching a lot of sources produces a lot of noise, and acting on noise is expensive. This scans, classifies and reduces everything to a card, then waits for a person before anything moves.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'An automated scout that acts on its own judgement will eventually act on its own bad judgement, and the cost lands on whoever is downstream. The interesting part is not finding the signal; it is deciding what a human should be asked about.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Niche sources scanned on a schedule',
          'Signals classified before they reach a person',
          'A decision-ready card per signal, with the reasoning attached',
          'An approval step that nothing passes without',
          'Containerised and self-hosted so the data stays on the machine',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'The pipeline is built to stop. Every stage can end in a card and a person, which is a deliberate limitation: an automated scout that cannot be interrupted is a liability with a dashboard. Each card carries why it was raised, so a rejection is a decision with a reason rather than a shrug.',
        ],
      },
    ],
  },

  'net-cat': {
    scope: 'Go service',
    standfirst:
      'Netcat is the tool everyone reaches for, and the only way to learn it is to read the source. This is the same job written out in Go, small enough to read in one sitting.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'netcat does one job, does it on every machine, and is understood by almost nobody. Tools that are understood get used; tools that are not get rediscovered badly every time.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'A concurrent chat server with one goroutine per connection',
          'Sends and receives on the same binary',
          'Builds to a single file that runs anywhere',
          'Source short enough to read end to end',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'The work here is waiting on other people, so concurrency is the design rather than an optimisation. Simplicity is treated as a feature of the artefact: a chat server is not the place to demonstrate what a framework can do.',
        ],
      },
    ],
  },

  forum: {
    scope: 'Go and SQLite',
    standfirst:
      'A question and answer site is three things: ask, answer, and rank. This is those three, in Go, over a database in a single file.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'The hard parts of a forum are not the forms. They are the ordering of answers, the count of votes staying true when two people vote at the same moment, and a comment tree that does not become a wall.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Questions, answers and votes with ranking by score and age',
          'Nested comments under each answer',
          'Tagging so questions can be found later',
          'A schema legible enough to read in one sitting',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'Ranking happens in the query rather than in a cached list, so an ordering is never stale by the time somebody reads it. SQLite is the right store here because the point is the shape of the schema, and a file is a far more honest way to learn one than a cluster.',
        ],
      },
    ],
  },

  'groupie-tracker': {
    scope: 'Go and React',
    standfirst:
      'Fans want to know when a band is playing near them without checking six websites. This collects the announcements and puts them in date order.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Concert information is announced in places built for announcing, not for finding. A fan has to follow the right accounts, filter out the ones they do not care about, and still miss the show in their own city.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Announcements collected from public sources',
          'Events listed in date order rather than as a feed',
          'A Go service behind the API',
          'A React front end built around what is next',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'The interface answers what is next, not what is newest, because a past announcement is worth nothing to the person reading. The Go service keeps the collection logic in one place and leaves the client a thin reader, which is the split that survives the next source being added.',
        ],
      },
    ],
  },

  'url-shortener': {
    scope: 'Distributed service',
    standfirst:
      'Shortening a link is trivial once. Doing it on every request, from more than one machine, without two people receiving the same short code is the actual work.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'A shortener is a lookup table that has to be right the first time. Two machines handing out the same code is not a rare edge case; it is the normal case on a busy day, and it is the one failure users notice immediately.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Short codes generated so collisions do not need to be retried blindly',
          'The hot mapping held in memory in Redis',
          'A durable record alongside the cache',
          'A stateless service that can run on more than one machine',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'Redis is the hot path and the durable store is the answer to the question of what happened, so a cache loss costs time rather than links. Code generation is designed so that a collision cannot be handed out, instead of generating and retrying, which turns a correctness problem into a latency problem. Keeping the service stateless is what makes running a second instance a decision rather than a project.',
        ],
      },
    ],
  },

  'secure-rest-api': {
    scope: 'Foundational build',
    standfirst:
      'My first complete service, written to get the unexciting parts right: authenticated routes, signed transport, and CRUD that works all the way through.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Most of what separates a service that survives contact with a network from a tutorial is not interesting: does it refuse unauthenticated requests, is the transport actually signed, and does every endpoint do the same thing the documentation says.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Full create, read, update and delete over a REST contract',
          'User authentication on the routes rather than in the interface',
          'Signed TLS so the transport is not assumed',
          'Consistent error shapes across every handler',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'Authentication is enforced in the handler layer, so removing a screen can never remove a check. The transport is signed rather than trusted, because the local machine is not the only machine that will eventually talk to it.',
        ],
      },
    ],
  },

  'stocks-api': {
    scope: 'Go and PostgreSQL',
    standfirst:
      'Price data is time-series, and most of the engineering in a stocks API is in how it is stored and queried rather than in what it returns.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'A question like what did this symbol do last quarter should be a range query. Written naively it is a full scan of every observation ever taken, and it works perfectly in testing and fails on the first real request.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Prices keyed by symbol and timestamp so ranges are ranges',
          'A read path separate from the write path',
          'Validation before anything is stored',
          'Go handlers that stay thin',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'The table is ordered by symbol and time rather than by insertion, because the schema decides whether a range query is cheap. Reads never write, so reporting cannot slow down or corrupt ingestion.',
        ],
      },
    ],
  },

  'cloner-news': {
    scope: 'Frontend',
    standfirst:
      'The Hacker News API hands back a graph of items and identifiers, not pages. This is the part that turns that into something you can read, including the comment threads.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'A story is one request. Its comments are a tree of hundreds of items, each of which can have children, and the tree is where an interface like this normally falls over.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Stories, jobs and polls from the official API',
          'Comment threads rendered depth-first with a depth cap',
          'One client for every request, so caching and failure live in one place',
          'Nothing held in cache longer than it has to be',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'The depth cap is a correctness decision, not a performance one: a thread deep enough to overflow the stack will do so on the thread nobody tested with. Every request goes through a single client, which is what makes a cached response and a failed one behave the same everywhere in the interface.',
        ],
      },
    ],
  },

  crossword: {
    scope: 'Solver and generator',
    standfirst:
      'Filling a crossword is a search problem, and almost all of the engineering is in not spending an hour inside the wrong subtree.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Place a word, check the crossings, and back out when a dead end appears. Done naively this explores an enormous number of boards before it finds a solution, and done carelessly it returns the first answer it sees, which is not the same as returning the right one.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Puzzles parsed from a text template of the grid',
          'Backtracking search with forward checking on every placement',
          'Placement validation against the grid before a word is committed',
          'Uniqueness proved before a completed puzzle is returned',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'Forward checking is what makes the search usable: a placement that leaves an empty cell no remaining word can fill is abandoned immediately rather than several levels deeper. Uniqueness is proved by continuing the search for a second solution, and that is the difference between a generator that returns a puzzle and one that returns a puzzle with one answer.',
        ],
      },
    ],
  },

  'social-network': {
    scope: 'Zone01 core project',
    standfirst:
      'A social platform in Go with a deliberately plain front end, built as the core project of the Zone01 Kisumu programme.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'The interesting middle of a social network is not the profile page, it is the edges: who follows whom, what is visible to whom, and what happens when two people act on the same relationship at the same moment.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Accounts, profiles and posts over a Go API',
          'Follow relationships and the permissions that follow from them',
          'A front end in plain HTML, CSS and JavaScript',
          'SQLite for the schema and Docker for the run',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'No front-end framework, on purpose. With the client this plain, the server contract is visible in every view, which is the thing being learned. One container for the whole stack means the project starts the same way on every machine, including the ones it is demonstrated on.',
        ],
      },
    ],
  },

  'students-complaints-portal': {
    scope: 'MVP build',
    standfirst:
      'A student complaint lives in an inbox, so nobody can tell whether it is being handled. This gives it a status, a history and a queue.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Students raise a problem, an official reads it, and then the thread goes quiet. The student has no way of finding out what happened, and the administrator has no way of knowing what is still open, because the record of a complaint is a mailbox.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Students submit a complaint and follow its status',
          'Named states so a complaint is visibly in progress',
          'Role-based access: students see their own, administrators see the queue',
          'Email notification on submission and on each change of state',
          'Reporting over the queue for the people who have to answer for it',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'The student view and the administrator dashboard are built from the same records, so the two can never disagree about what is outstanding. Access is enforced on the role, which is why a student cannot discover another student by changing an identifier.',
        ],
      },
    ],
  },

  'agri-tool-app': {
    scope: 'Full stack',
    standfirst:
      'Agricultural advice is scattered across sources written for people with a connection and a vocabulary. This puts a Python analysis service behind a MERN interface built for a phone in a field.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'The analysis is the difficult part and it changes faster than the interface. Coupling them means every improvement to a model needs a front-end release, and every interface improvement has to wait for the analysis.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Analysis served from a Python API',
          'A React client over MongoDB for everything the user owns',
          'Results returned with the date and the source they came from',
          'A layout built for a small screen on a slow connection',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'The split between the analysis service and the application is deliberate: the model can change without shipping the interface. Every result carries the date it was computed for, because advice without a date is not advice.',
        ],
      },
    ],
  },

  'neetcode-v1': {
    scope: 'Frontend',
    standfirst:
      'Interview practice behind a paywall is not practice. This is the same roadmap, free, with no payment path to remove later.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'A course that might ask for money later has to be designed around the possibility of asking, and that shows: locked sections, a progress number that means nothing, and content split into parts to be sold separately.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Free courses with no account required to start',
          'Progress measured as a position on the roadmap',
          'A lightweight client that loads on a slow connection',
          'No payment path anywhere in the code',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'Free by design rather than free during a trial, so no part of the system exists to be switched on later. Progress is a place on the roadmap instead of a percentage, because a percentage cannot tell you what to do next.',
        ],
      },
    ],
  },

  'laravel-property-management': {
    scope: 'Property records',
    standfirst:
      'A landlord keeps their records in a spreadsheet, their keys in a drawer and their memory. This is the tenancy, the money and the repairs in one place.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Rentals fall apart on the boring middle: which unit is let, to whom, until when, what was paid, what is broken. None of that is difficult, and all of it ends up in places that do not talk to each other.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Properties, units and tenants in one schema',
          'Lease terms, so a rent change has a date attached to it',
          'Payment history per tenancy',
          'Maintenance requests against a unit',
          'A Vue interface on top of the Laravel backend',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'One schema for properties, units and tenants means a unit is entered once and referenced thereafter, which is the difference between a record and a spreadsheet that looks like one. Vue is used for the parts of the interface that are genuinely interactive, and the pages that are mostly a table stay on the server.',
        ],
      },
    ],
  },

  'njeri-koimett-adv': {
    scope: 'Phased delivery',
    standfirst:
      'A small legal firm needs its public information to be right and current, without a member of staff maintaining a website. Delivered in phases, with the public site standing on its own.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'A firm website usually fails in one of two ways: nobody can change it, so the practice areas and contacts go out of date, or whoever changes it can break it. Both come from the same mistake, which is treating content as part of the code.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Practice areas, fee information and contacts editable without code',
          'A typed client so a change cannot quietly alter a page',
          'A public site that stands alone in the first phase',
          'Case-handling to follow once the public record is correct',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'TypeScript across the client is a content decision as much as a technical one: it means a content edit that would break a page fails at build time rather than in front of a client. Phasing keeps the public site independent, so the firm is not waiting on a later phase to have a correct website.',
        ],
      },
    ],
  },

  klimatt: {
    scope: 'Offline-first PWA',
    standfirst:
      'Smallholder farmers in places with unreliable connectivity need three things and cannot wait for a network to answer: when to plant, what is wrong with this plant, and what is the crop worth today.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Every version of this that assumes connectivity fails in exactly the place it is needed most. A crop calendar that will not open in the field is not slow, it is absent, and a price that arrives a day late is not a price.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Crop calendars that open with no network at all',
          'Pest identification from photographs, on device',
          'Market prices held locally and refreshed when a connection appears',
          'Installable to the home screen and usable offline once installed',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'Offline is the normal case and the network is the recovery path, which reverses the usual assumption and changes every loading state in the interface. The reference material ships inside the app rather than being fetched, so a farmer in a valley gets the same crop calendar as one at the roadside tower.',
        ],
      },
    ],
  },

  argus: {
    scope: 'Go command line',
    standfirst:
      'One coding agent at a time leaves the machine idle, and an agent that needs approval stops the whole queue. This runs several at once and keeps the decisions on your phone.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Agents are normally run as interactive sessions, which means a terminal is tied up and every approval is a reason to walk back to the desk. Neither scales past one task, so the machine spends most of the day waiting for a person.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Several agents running at once as supervised processes',
          'One event log covering everything every agent did',
          'Approvals and interventions from a phone',
          'A single command centre over the whole set',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'Agents are supervised processes rather than interactive sessions, which is what allows more than one to run at once. A single event log is the source of truth for all of them, so when something goes wrong there is one place to read rather than a dozen terminals. Being able to walk away is a design requirement, not a feature, so the phone path was built first.',
        ],
      },
    ],
  },

  'argus-web': {
    scope: 'Marketing site',
    standfirst:
      'Argus is a terminal tool. The site has to explain it to somebody who has never opened one, which is a writing problem more than a design problem.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Developer tools are usually marketed to people who already use developer tools, which means the page convinces nobody new. The reader who matters here is deciding whether this is worth installing, and they arrive from a search result with no context at all.',
        ],
      },
      {
        heading: 'What the system does',
        list: [
          'Static pages organised around the problem, not the feature list',
          'One figure per idea, each doing a specific job',
          'A live demonstration rather than a recorded tour',
          'A route to install in one step from the first screen',
        ],
      },
      {
        heading: 'Decisions worth naming',
        body: [
          'Astro, because the site is words and figures and nothing on it needs a client-side router; static output is the correct default here rather than a compromise. The order of the page is the order of the reader questions: what it does, why it is different, how to start.',
        ],
      },
    ],
  },
};

const CONSOLE_FILLER = [
  'imported directly from the github repository',
  'review and extend these case notes',
  'core implementation in',
];

export const isConsoleCopy = (content) => {
  const text = (content || '').trim().toLowerCase();
  if (text.length < 80) return false;
  return CONSOLE_FILLER.some((phrase) => text.includes(phrase));
};

export const getCaseNote = (project) => {
  if (!project?.slug) return null;
  return caseNotes[project.slug] || null;
};
