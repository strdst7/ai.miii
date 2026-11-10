from html import escape
from collections import defaultdict
entries = [
('Nov 2026','Data Science and AI For Decision Making','Harvard Business School Online','',''),
('Nov 2026','Claude Academy: Claude 101','Anthropic','',''),
('Oct 2026','CS50 Introduction to Computer Science','Harvard University','',''),
('Oct 2026','CS50W: CS50’s Web Programming with Python and Java Script','HarvardX','',''),
('Oct 2026','Prompt & AI Engineering Safety Professional Certification','Institute of Management, Technology and Finance','',''),
('Oct 2026','Foundations of Software Development','CodeSignal','',''),
('Oct 2026','AI Leadership','OpenAI','Expires Apr 2027','https://www.credential.net/e9b7a70b-91a9-4cd5-8b5c-b0bfde5f6660#acc.RpzrLHaU'),
('Oct 2026','Claude Academy: AI capabilities and limitations','Anthropic','',''),
('Oct 2026','Oracle Agentic AI Certified Foundations Associate','Oracle','Expires Oct 2028 · Credly item marked unverified',''),
('Oct 2026','Claude Academy: Claude Code in action','Anthropic','',''),
('Oct 2026','Claude Academy: AI Fluency: Framework and foundations','Anthropic','',''),
('Oct 2026','Claude Academy: Building effective human-agent teams (beta)','Anthropic','',''),
('Oct 2026','CRUD Operations in MongoDB','MongoDB','Credly issue date: Oct 16, 2026',''),
('Oct 2026','Astronomer Certified for AI Orchestration Fundamentals','Astronomer','Credly issue date: Oct 7, 2026',''),
('Sep 2026','Kracked Labs - Builders Sandbox: Certificate of Participation','krackeddevs','Participation','https://learn.theaibuilder.school/certificates/KD-2026-0073-57a398e1'),
('Sep 2026','Understanding Digital Transformation','MyDIGITAL Corporation','',''),
('Sep 2026','Build a Secure Google Cloud Network Skill Badge','Google','','https://www.credly.com/badges/f91f8e43-0551-4131-a839-4760c0f8ddea/public_url'),
('Aug 2026','Mentor [Human Agent] for The Malaysian Learn-a-thon!','krackeddevs','Mentoring recognition','https://krackeddevs.com/certificates/217c1f93-1837-49d4-b5d4-90c2142005a7'),
('Jul 2026','IQ Test Certificate','MyIQ','Assessment',''),
('May 2026','Google Advanced Data Analytics Professional Certificate(v.2)','Coursera','Potentially related to the Google entry below',''),
('May 2026','Google Advanced Data Analytics','Google','Potentially related to the Coursera entry above',''),
('May 2026','Agentic AI Builder','Ready Tensor, Inc.','','https://app.readytensor.ai/certificates/6198a102-d3a2-4e38-95d2-760fb720906f'),
('May 2026','Google Advanced Data Analytics Capstone','Google','',''),
('May 2026','The Nuts and Bolts of Machine Learning','Google','',''),
('Apr 2026','Regression Analysis: Simplify Complex Data Relationships','Google','',''),
('Apr 2026','The Power of Statistics','Google','',''),
('Apr 2026','Go Beyond the Numbers: Translate Data into Insights','Google','',''),
('Mar 2026','Agentic AI Engineer','Ready Tensor, Inc.','','https://app.readytensor.ai/certificates/2ffbb0db-a03e-450e-a0ed-5789fea8adce'),
('Mar 2026','Gemini for Data Scientists and Analysts','Google','',''),
('Mar 2026','Create Your First Gemini Enterprise Application','Google','LinkedIn lists Mar 2026; Credly lists Apr 10, 2026',''),
('Mar 2026','Enterprise Agents and Use Cases','Google','',''),
('Mar 2026','Foundations of Data Science','Google','',''),
('Mar 2026','Create ML Models with BigQuery ML Skill Badge','Google','',''),
('Mar 2026','Cloud Architecture: Design, Implement, and Manage Skill Badge','Google','',''),
('Feb 2026','RAG Systems Expert','Ready Tensor, Inc.','',''),
('Feb 2026','AI For MY Future','Microsoft','',''),
('Feb 2026','Introduction to Computers and Operating Systems and Security','Microsoft','',''),
('Jan 2026','Foundations of Project Management','Google','',''),
('Jan 2026','Google AI for K12 Educators','Google','',''),
('Jan 2026','Gemini Certified Educator','Google','Expires Jan 2029',''),
('Oct 2025','Blockchain untuk Rakyat','Ministry of Science, Technology and Innovation','',''),
('Oct 2025','AI Fluency','Ministry of Science, Technology and Innovation','',''),
('Oct 2025','Cloud untuk Rakyat','Ministry of Science, Technology and Innovation','',''),
('Oct 2025','Generative AI','Ministry of Science, Technology and Innovation','',''),
('Oct 2025','CyberSAFE untuk Rakyat','Ministry of Science, Technology and Innovation','',''),
('Oct 2025','AI Appreciate','MyDIGITAL Corporation','',''),
('Oct 2025','AI Aware','MyDIGITAL Corporation','',''),
('Jul 2025','Operational Excellence Foundations','LinkedIn','',''),
('Jul 2025','Operations Strategy for Business','LinkedIn','',''),
('Jul 2025','Describe the finance and operations apps','Microsoft','',''),
]
assert len(entries)==50
head='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="A record of Mia’s learning milestones, courses, badges and certifications."><meta name="theme-color" content="#cabcf2"><title>Certifications — miii.ai</title><link rel="stylesheet" href="style.css"></head><body class="cert-page"><header class="cert-header" id="top"><a href="index.html" class="logo" aria-label="miii.ai home">miii<span>.</span>ai</a><span class="header-center"><span class="live-dot"></span> AN OPEN LEARNING JOURNAL</span><a href="index.html#notes" class="cert-back">BACK TO THE JOURNEY</a></header><main><section class="cert-hero"><div class="section-kicker"><span>THE LEARNING ARCHIVE / 01—50</span><span>ALWAYS IN PROGRESS ✳</span></div><div class="cert-hero-content"><div><div class="little-label">A RECORD OF THE PROCESS</div><h1>Little markers.<br><em>Big curiosity.</em></h1></div><p>Courses, credentials, badges, and a few other milestones from my learning journey. They’re reminders of the work, not the finish line.</p></div><div class="cert-stats"><span><strong>50</strong> LINKEDIN ENTRIES</span><span><strong>2025—26</strong> LISTED ISSUE DATES</span><span><strong>∞</strong> MORE TO LEARN</span></div></section><section class="cert-list-section"><div class="section-kicker"><span>THE FULL LIST</span><span>BASED ON THE SUPPLIED LINKEDIN PDF</span></div><div class="cert-intro"><div><h2>A trail of<br><em>learning.</em></h2><p>Browse the 50 entries exactly as listed in my LinkedIn PDF, including course completions, badges, participation and mentoring recognition.</p></div><div class="cert-disclosure"><strong>A note on verification</strong><p>These are LinkedIn-listed entries, not all independently verified. Issue dates are month-level unless otherwise noted. Direct credential links are included where a public URL was available in the PDF.</p><p>The Oracle item is marked unverified on Credly. The two Google Advanced Data Analytics entries may describe the same qualification. “Create Your First Gemini Enterprise Application” has different dates on LinkedIn and Credly.</p></div></div><div class="cert-controls"><label for="cert-search">SEARCH THE ARCHIVE</label><div class="search-wrap"><input type="search" id="cert-search" placeholder="Search by name, issuer, or date…" autocomplete="off"><span aria-hidden="true">⌕</span></div><p id="cert-count" aria-live="polite">Showing all 50 entries</p></div><div class="cert-list">'''
parts=[]
for i,(date,title,issuer,note,url) in enumerate(entries,1):
 search=escape(' '.join([date,title,issuer,note]).lower(),quote=True)
 link=f'<a href="{escape(url,quote=True)}" target="_blank" rel="noopener noreferrer" aria-label="Open credential for {escape(title,quote=True)}">OPEN CREDENTIAL</a>' if url else '<span class="no-link">LINK NOT PROVIDED</span>'
 parts.append(f'<article class="cert-entry" data-search="{search}"><span class="cert-num">{i:02}</span><div class="cert-entry-main"><h3>{escape(title)}</h3><p>{escape(issuer)}</p>'+ (f'<small>{escape(note)}</small>' if note else '')+f'</div><span class="cert-date">{escape(date.upper())}</span><div class="cert-link">{link}</div></article>')
tail='''</div><p class="no-results" hidden>No matching entries. Try a different search.</p><div class="cert-end"><p>These milestones are one part of the story. There’s always more to learn.</p><a class="pill dark" href="index.html#journey">Back to the journey </a></div></section></main><footer><div class="footer-main"><a class="footer-logo" href="index.html">miii.ai</a><p>A personal learning journal.<br>Built with curiosity in Kuala Lumpur.</p><div class="footer-links"><a class="github-footer" href="https://github.com/strdst7/strdst7" target="_blank" rel="noopener noreferrer"><svg class="github-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-1.9c-3.11.68-3.77-1.32-3.77-1.32-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.72.39-1.22.71-1.5-2.49-.28-5.11-1.24-5.11-5.53 0-1.22.44-2.22 1.15-3-.11-.28-.5-1.43.11-2.97 0 0 .94-.3 3.08 1.15a10.72 10.72 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.22 2.69.11 2.97.72.78 1.15 1.78 1.15 3.01 0 4.3-2.63 5.24-5.13 5.52.4.35.76 1.03.76 2.07v2.89c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"/></svg><span>GitHub</span></a><a href="https://www.linkedin.com/in/nur-amirah-mohd-kamil-/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://app.readytensor.ai/users/nuramirahmohdkamil" target="_blank" rel="noopener noreferrer">Ready Tensor</a><a href="https://www.credly.com/users/nur-amirah-mohd-kamil/badges" target="_blank" rel="noopener noreferrer">Credly</a></div></div><div class="footer-bottom"><span>© MIII.AI / NUR AMIRAH MOHD KAMIL</span><span>ALWAYS A WORK IN PROGRESS ✳</span><a href="#top" id="back-top">BACK TO TOP</a></div></footer><script src="certifications.js"></script></body></html>'''
open('certifications.html','w').write(head+'\n'.join(parts)+tail)
