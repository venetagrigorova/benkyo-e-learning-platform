// import Showdown from 'showdown';
// const converter = new Showdown.Converter();

const documentation = `
<style>
/*
* Markdown PDF CSS
*/

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", "Ubuntu", "Droid Sans", sans-serif, "Meiryo";
  padding: 0 12px;
}

pre {
  background-color: #f8f8f8;
  border: 1px solid #cccccc;
  border-radius: 3px;
  overflow-x: auto;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

pre:not(.hljs) {
  padding: 23px;
  line-height: 19px;
}

blockquote {
  background: rgba(127, 127, 127, 0.1);
  border-color: rgba(0, 122, 204, 0.5);
}

.emoji {
  height: 1.4em;
}

code {
  font-size: 14px;
  line-height: 19px;
}

/* for inline code */
:not(pre):not(.hljs)>code {
  color: #C9AE75;
  /* Change the old color so it seems less like an error */
  font-size: inherit;
}

/* Page Break : use <div class="page"/> to insert page break
-------------------------------------------------------- */
.page {
  page-break-after: always;
}
</style>

<script src="https://unpkg.com/mermaid/dist/mermaid.min.js"></script>
</head>

<body>
<script>
  mermaid.initialize({
    startOnLoad: true,
    theme: document.body.classList.contains('vscode-dark') || document.body.classList.contains('vscode-high-contrast')
      ? 'dark'
      : 'default'
  });
</script>
<h1 id="benky%C5%8D-api">BENKYŌ API</h1>
<p>The Benkyō API provides a structured and intuitive interface with our servers, enabling profile creation,
  authentication, and data modification.</p>
<p>The Benkyō API follows a simple hierarchy of content. It can be divided in two categories, which also help
  understanding the database schema.</p>
<p>Identification is implemented with the Passport middleware and its token strategy.</p>
<p>The API is currently planned for a reasonable amount of content and therefore pagination or filtering is up to the
  client.</p>
<ol>
  <li><a href="#benky%C5%8D-api">BENKYŌ API</a>
    <ol>
      <li><a href="#definitions">Definitions</a></li>
      <li><a href="#authentication">Authentication</a></li>
      <li><a href="#permissions">Permissions</a></li>
      <li><a href="#date-restrictions">Date restrictions</a></li>
      <li><a href="#lesson-date">Lesson date</a></li>
      <li><a href="#requests-and-responses">Requests and responses</a></li>
      <li><a href="#dates">Dates</a></li>
      <li><a href="#content">Content</a>
        <ol>
          <li><a href="#auth"><strong>AUTH</strong></a>
            <ol>
              <li><strong>LOGIN</strong>     <code>POST /auth</code></li>
              <li><strong>LOGOUT</strong>     <code>POST /auth</code></li>
            </ol>
          </li>
          <li><a href="#courses"><strong>COURSES</strong></a>
            <ol>
              <li><strong>GET ALL COURSES</strong>     <code>GET /courses</code></li>
              <li><strong>GET COURSE BY ID</strong>     <code>GET /courses/:courseId</code></li>
              <li><strong>POST COURSE</strong>     <code>POST /courses</code></li>
              <li><strong>PUT COURSE</strong>     <code>PUT /courses/:courseId</code></li>
              <li><strong>DELETE COURSE</strong>     <code>DELETE /courses/:courseId</code></li>
            </ol>
          </li>
          <li><a href="#course-permissions"><strong>COURSE PERMISSIONS</strong></a>
            <ol>
              <li><strong>GET PERMISSIONS</strong>     </li>
              <li><strong>ADD PERMISSIONS</strong>     </li>
              <li><strong>REMOVE PERMISSIONS</strong>     </li>
            </ol>
          </li>
          <li><a href="#course-self-enroll"><strong>COURSE SELF-ENROLL</strong></a>
            <ol>
              <li><strong>POST SELF-ENROLL</strong>     </li>
              <li><strong>DELETE SELF-ENROLL</strong>     </li>
            </ol>
          </li>
          <li><a href="#course-progress"><strong>COURSE PROGRESS</strong></a>
            <ol>
              <li><strong>GET PROGRESS</strong>     <code>GET /courses/:courseId/progress</code></li>
            </ol>
          </li>
          <li><a href="#course-topics"><strong>COURSE TOPICS</strong></a>
            <ol>
              <li><strong>PUT TOPICS</strong>     <code>PUT /courses/:courseId/topics</code></li>
            </ol>
          </li>
          <li><a href="#sectionscoursescourseid"><strong>SECTIONS</strong>     <code>/courses/:courseId</code></a>
            <ol>
              <li><strong>GET SECTIONS</strong>     <code>GET /sections</code></li>
              <li><strong>GET SECTION BY ID</strong>     <code>GET /sections/:sectionId</code></li>
              <li><strong>POST SECTION</strong>     <code>POST /sections/</code></li>
              <li><strong>PUT SECTION</strong>     <code>PUT /sections/:sectionId</code></li>
              <li><strong>DELETE SECTION</strong>     <code>DELETE /sections/:sectionId</code></li>
            </ol>
          </li>
          <li><a href="#lessons"><strong>LESSONS</strong></a>
            <ol>
              <li><strong>GET ALL LESSONS</strong>     <code>GET /courses/:courseId/sections/:sectionId/lessons</code>
              </li>
              <li><strong>GET LESSON BY
                  ID</strong>     <code>GET /courses/:courseId/sections/:sectionId/lessons/:lessonId</code></li>
              <li><strong>CREATE LESSON</strong>     <code>POST /courses/:courseId/sections/:sectionId/lessons</code>
              </li>
              <li><strong>UPDATE
                  LESSON</strong>     <code>PUT /courses/:courseId/sections/:sectionId/lessons/:lessonId</code></li>
              <li><strong>DELETE
                  LESSON</strong>     <code>DELETE /courses/:courseId/sections/:sectionId/lessons/:lessonId</code>
              </li>
              <li><strong>MARK LESSON AS
                  COMPLETE</strong>     <code>POST /courses/:courseId/sections/:sectionId/lessons/:lessonId/complete</code>
              </li>
              <li><strong>MARK LESSON AS
                  INCOMPLETE</strong>     <code>DELETE /courses/:courseId/sections/:sectionId/lessons/:lessonId/incomplete</code>
              </li>
            </ol>
          </li>
          <li><a href="#announcements"><strong>ANNOUNCEMENTS</strong></a>
            <ol>
              <li><strong>GET ALL COURSE ANNOUNCEMENTS</strong>     <code>GET /courses/:courseId/announcements</code>
              </li>
              <li><strong>GET
                  ANNOUNCEMENT</strong>     <code>GET /courses/:courseId/announcements/:announcementId</code></li>
              <li><strong>UPDATE
                  ANNOUNCEMENT</strong>     <code>PUT /courses/:courseId/announcements/:announcementId</code></li>
              <li><strong>DELETE
                  ANNOUNCEMENT</strong>     <code>DELETE /courses/:courseId/announcements/:announcementId</code></li>
            </ol>
          </li>
          <li><a href="#topicstopics"><strong>TOPICS</strong>     <code>/topics/</code></a></li>
          <li><strong>GET ALL TOPICS</strong>     <code>GET /topics</code></li>
        </ol>
      </li>
    </ol>
  </li>
</ol>
<h2 id="definitions">Definitions</h2>
<ul>
  <li>
    <p><strong>Username</strong>:<br>
      Refers to the email address.</p>
  </li>
  <li>
    <p><strong>Role</strong>:<br>
      Users can be either anonymous, students, or teachers. Although anyone is free to create a Benkyō account, the
      teacher status is reserved.</p>
  </li>
  <li>
    <p><strong>Privacy</strong>:
      Defines whether the course is public or private with a boolean value (<code>false</code> for public,
      <code>true</code> for private).
    </p>
  </li>
  <li>
    <p><strong>Enrollment</strong>:<br>
      Teachers can enroll students into their courses. Only enrolled students are able to access the content of a
      course.</p>
  </li>
  <li>
    <p><strong>Self-enrollement</strong>:<br>
      When a user visits a course (public if student and any if teacher), they are de facto enrolled in that course.
      Teachers have visibility on these self-enrolled enrolled as well.</p>
  </li>
</ul>
<h2 id="authentication">Authentication</h2>
<p>If provided with a valid username (email address) and password, the API will return a token with the following
  information: user id, email, first name, last name, role.</p>
<p>Please use a bearer token authentication in your HTTP requests.</p>
<p>When a user logs in, their token is stored in the database as an implementation of white listing. Every request
  submitted with a token will have its authenticity verified by looking the database for an equal token.</p>
<p>Upon logout, the token is deleted from the database and any further request containing this token will be rejected.
</p>
<h2 id="permissions">Permissions</h2>
<p>Their are 5 levels of permissions in Benkyō, based on the role and the relation of the client to the requested
  resource:</p>
<ul>
  <li><strong>anonymous</strong> users</li>
  <li><strong>unenrolled logged users</strong> (relatively to a course)</li>
  <li><strong>enrolled logged users</strong> (idem)</li>
  <li><strong>teachers</strong> (idem)</li>
  <li><strong>owner teacher</strong> (idem)</li>
</ul>
<p>The content of most responses to GET requests adjusts to the permissions of the client.</p>
<h2 id="date-restrictions">Date restrictions</h2>
<p>By setting date restrictions on courses and sections, teachers can restrict their content for a definite time.
  Those restrictions do not apply to students with the role of teacher.</p>
<h2 id="lesson-date">Lesson date</h2>
<p>Teachers can specify a date and time on which the lesson will be held.</p>
<h2 id="requests-and-responses">Requests and responses</h2>
<p>Following the REST specifications, requests are stateless and must embed all the information necessary to their
  completion. GET and DELETE requests mostly find their information in the URL parameters, POST and PUT in the request
  body.</p>
<p>Responses follow a unified format which allows for simple success check and data handling.</p>
<pre class="hljs"><code><div>{
errorCode: <span class="hljs-built_in">number</span> || <span class="hljs-literal">null</span>,
data: <span class="hljs-built_in">any</span>,
}
</div></code></pre>
<p>Error codes <strong>are</strong> single-digit integers, semantically overlapping with HTTP codes but widening the
  checking possibilities of the client.</p>
<p><strong>NB</strong> the response formats presented below will always be stored in the <code>data</code> field of
  the response body.</p>
<h2 id="dates">Dates</h2>
<p>Dates should be sent in UTC format (or RFC 3339). The same format will be used in responses.</p>
<h2 id="content">Content</h2>
<p>The content comprises courses, sections and lessons, nested in that order.</p>
<p>Creating, updating and deleting any of those resources is stricly reserved to users benefitting of the teacher
  role.</p>
<p>Courses, sections and lessons have in the common the following fields:</p>
<style type="text/css">
  .tg {
    border-collapse: collapse;
    border-color: #aaa;
    border-spacing: 0;
    margin: 0px auto;
  }

  .tg td {
    background-color: #fff;
    border-color: #aaa;
    border-style: solid;
    border-width: 1px;
    color: #333;
    font-family: Arial, sans-serif;
    font-size: 14px;
    overflow: hidden;
    padding: 10px 5px;
    word-break: normal;
  }

  .tg th {
    background-color: #f38630;
    border-color: #aaa;
    border-style: solid;
    border-width: 1px;
    color: #fff;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: normal;
    overflow: hidden;
    padding: 10px 5px;
    word-break: normal;
  }

  .tg .tg-oe15 {
    background-color: #ffffff;
    border-color: #ffffff;
    text-align: left;
    vertical-align: top
  }

  .tg .tg-zv4m {
    border-color: #ffffff;
    text-align: left;
    vertical-align: top
  }

  .tg .tg-w25z {
    background-color: #ffce93;
    border-color: #ffffff;
    text-align: center;
    vertical-align: top
  }

  .tg .tg-8jgo {
    border-color: #ffffff;
    text-align: center;
    vertical-align: top
  }
</style>
<table class="tg" style="table-layout: fixed; width: 766px">
  <colgroup>
    <col style="width: 166px">
    <col style="width: 175px">
    <col style="width: 148px">
    <col style="width: 277px">
  </colgroup>
  <tbody>
    <tr>
      <td class="tg-8jgo">Course</td>
      <td class="tg-8jgo">Section</td>
      <td class="tg-8jgo">Lesson</td>
      <td class="tg-oe15"></td>
    </tr>
    <tr>
      <td class="tg-w25z" colspan="3">id</td>
      <td class="tg-oe15"></td>
    </tr>
    <tr>
      <td class="tg-w25z" colspan="3">title</td>
      <td class="tg-oe15"></td>
    </tr>
    <tr>
      <td class="tg-w25z" colspan="3">description</td>
      <td class="tg-oe15"></td>
    </tr>
    <tr>
      <td class="tg-w25z" colspan="3">uploadDate</td>
      <td class="tg-oe15">date at which the item was created</td>
    </tr>
    <tr>
      <td class="tg-zv4m"></td>
      <td class="tg-w25z">courseId</td>
      <td class="tg-w25z">sectionId</td>
      <td class="tg-zv4m">id of the parent of the item</td>
    </tr>
    <tr>
      <td class="tg-8jgo"></td>
      <td class="tg-8jgo"></td>
      <td class="tg-w25z">content*</td>
      <td class="tg-oe15"></td>
    </tr>
    <tr>
      <td class="tg-w25z">isprivate</td>
      <td class="tg-oe15"></td>
      <td class="tg-oe15"></td>
      <td class="tg-oe15">audience of the course</td>
    </tr>
    <tr>
      <td class="tg-w25z">dateRestriction</td>
      <td class="tg-8jgo"></td>
      <td class="tg-8jgo"></td>
      <td class="tg-oe15">date at which the item will be accessible to enrolled students</td>
    </tr>
    <tr>
      <td class="tg-8jgo"></td>
      <td class="tg-8jgo"></td>
      <td class="tg-w25z">date</td>
      <td class="tg-oe15">date on which the lesson will be held</td>
    </tr>
    <tr>
      <td class="tg-8jgo"></td>
      <td class="tg-w25z" colspan="2">order</td>
      <td class="tg-oe15">position of the item in its parent</td>
    </tr>
    <tr>
      <td class="tg-w25z" colspan="3">lastUpdate</td>
      <td class="tg-oe15"></td>
    </tr>
    <tr>
      <td class="tg-w25z" colspan="3">isDeleted</td>
      <td class="tg-oe15"></td>
    </tr>
  </tbody>
</table>
<p>* The content of a lesson is stored as a stringified JSON object:</p>
<pre class="hljs"><code><div>{
body: <span class="hljs-built_in">string</span>        <span class="hljs-comment">// HTML content, no iframes or scripts</span>
iframes: <span class="hljs-built_in">string</span>[]   <span class="hljs-comment">// iframes with attributes, see below</span>
} 
</div></code></pre>
<h3 id="auth"><strong>AUTH</strong></h3>
<h4 id="login-post-auth"><strong>LOGIN</strong>     <code>POST /auth</code></h4>
<p>Any registered user can log in by sending a request containing their email and password. If the credentials match
  that in the database, a token will be issued with a validity of one day.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>

{
email: <span class="hljs-built_in">string</span>
password: <span class="hljs-built_in">string</span>
}

<span class="hljs-comment">// RESPONSE</span>

<span class="hljs-built_in">string</span>      <span class="hljs-comment">// The token string is the direct value of the data key of the response object</span>
</div></code></pre>
<h4 id="logout-post-auth"><strong>LOGOUT</strong>     <code>POST /auth</code></h4>
<p>Logging out is realised by sending a bodyless <code>DELETE</code> request to the API.</p>
<pre class="hljs"><code><div>
</div></code></pre>
<h3 id="courses"><strong>COURSES</strong></h3>
<h4 id="get-all-courses-get-courses"><strong>GET ALL COURSES</strong>     <code>GET /courses</code></h4>
<p>This endpoint will return a list of all the courses in the database, based on the permission level of the client.
</p>
<p>Anonymous users have access to <strong>public</strong> courses <strong>without</strong> section information.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// ANONYMOUS USER (only public courses*)</span>
{
courseId: <span class="hljs-built_in">number</span>,
courseTitle: <span class="hljs-built_in">string</span>,
courseDescription: <span class="hljs-built_in">string</span>,
courseIsprivate: <span class="hljs-literal">false</span>*,
courseUploadDate: <span class="hljs-built_in">string</span>,
courseOwnerId: <span class="hljs-built_in">number</span>,
courseDateRestriction: <span class="hljs-built_in">string</span>,
courseOwnerFirst: <span class="hljs-built_in">string</span>,
courseOwnerLast: <span class="hljs-built_in">string</span>,
courseTopics?: {
  topicId: <span class="hljs-built_in">number</span>,
  topicName: <span class="hljs-built_in">number</span>
  }[],
}

<span class="hljs-comment">// LOGGED USER (both public and private courses)</span>
{
courseId: <span class="hljs-built_in">number</span>,
courseTitle: <span class="hljs-built_in">string</span>,
courseDescription: <span class="hljs-built_in">string</span>,
courseIsprivate: <span class="hljs-built_in">boolean</span>,
courseUploadDate: <span class="hljs-built_in">string</span>,
courseOwnerId: <span class="hljs-built_in">number</span>,
courseDateRestriction: <span class="hljs-built_in">string</span>,
courseOwnerFirst: <span class="hljs-built_in">string</span>,
courseOwnerLast: <span class="hljs-built_in">string</span>,
courseTopics?: {
  topicId: <span class="hljs-built_in">number</span>,
  topicName: <span class="hljs-built_in">number</span>
  }[],
isEnrolled: <span class="hljs-built_in">boolean</span>,
}
</div></code></pre>
<h4 id="get-course-by-id-get-coursescourseid"><strong>GET COURSE BY
    ID</strong>     <code>GET /courses/:courseId</code></h4>
<p>This endpoint is restricted logged users. Teachers can access any course, students public courses and private
  courses they are enrolled in. The response includes the data mentioned above, as well as a summary sections of the
  course.</p>
<pre class="hljs"><code><div>{
courseId: <span class="hljs-built_in">number</span>
courseTitle: <span class="hljs-built_in">string</span>
courseDescription: <span class="hljs-built_in">string</span>
courseIsprivate: <span class="hljs-built_in">boolean</span>
courseUploadDate: <span class="hljs-built_in">string</span>
courseOwnerId: <span class="hljs-built_in">number</span>
courseDateRestriction: <span class="hljs-built_in">string</span>
courseOwnerFirst: <span class="hljs-built_in">string</span>
courseOwnerLast: <span class="hljs-built_in">string</span>
courseTopics?: CourseTopics[]
courseLastUpdate: <span class="hljs-built_in">string</span>
courseSections: {
  sectionId: <span class="hljs-built_in">number</span>
  sectionTitle: <span class="hljs-built_in">string</span>
  sectionUploadDate: <span class="hljs-built_in">string</span>
  sectionDateRestriction: <span class="hljs-built_in">string</span>
  sectionOrder: <span class="hljs-built_in">number</span>
}
}
</div></code></pre>
<h4 id="post-course-post-courses"><strong>POST COURSE</strong>     <code>POST /courses</code></h4>
<p><em>This endpoint is reserved to teachers.</em></p>
<p>Teachers can create courses by providing at least a title, description and audience. A date restriction can be
  provided as well.<br>
  The response will bear all the information related to the newly created course.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>

{
courseTitle: <span class="hljs-built_in">string</span>           <span class="hljs-comment">// 3 to 100 characters, no line breaks</span>
courseDescription: <span class="hljs-built_in">string</span>     <span class="hljs-comment">// minimum 20 characters, no line breaks</span>
courseIsprivate: <span class="hljs-built_in">boolean</span>
courseDateRestriction?: <span class="hljs-built_in">string</span> <span class="hljs-comment">// UTC or RFC3338</span>
}

<span class="hljs-comment">// RESPONSE</span>

{
courseId: <span class="hljs-built_in">number</span>
courseOwnerId: <span class="hljs-built_in">number</span>
courseTitle: <span class="hljs-built_in">string</span>
courseDescription: <span class="hljs-built_in">string</span>
courseIsprivate: <span class="hljs-built_in">boolean</span>
courseDateRestriction?: <span class="hljs-built_in">string</span>
}
</div></code></pre>
<h4 id="put-course-put-coursescourseid"><strong>PUT COURSE</strong>     <code>PUT /courses/:courseId</code></h4>
<p><em>This endpoint is reserved to teachers.</em></p>
<p>Teachers can create courses by providing at least a title, description and audience. A date restriction can be
  provided as well.<br>
  The response will bear all the information related to the newly created course.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>

{
courseTitle: <span class="hljs-built_in">string</span>           <span class="hljs-comment">// 3 to 100 characters, no line breaks</span>
courseDescription: <span class="hljs-built_in">string</span>     <span class="hljs-comment">// minimum 20 characters, no line breaks</span>
courseIsprivate: <span class="hljs-built_in">boolean</span>
courseDateRestriction?: <span class="hljs-built_in">string</span> <span class="hljs-comment">// UTC or RFC3338</span>
courseOwnerId: <span class="hljs-built_in">number</span>
}

<span class="hljs-comment">// RESPONSE</span>

{
 <span class="hljs-string">"courseId"</span>: <span class="hljs-number">97</span>,
      <span class="hljs-string">"courseTitle"</span>: <span class="hljs-string">"A new c"</span>,
      <span class="hljs-string">"courseDescription"</span>: <span class="hljs-string">"&lt;p&gt;Learn it all &amp;lt;3 We'll make great riors out of you.&lt;/p&gt;"</span>,
      <span class="hljs-string">"courseIsprivate"</span>: <span class="hljs-literal">false</span>,
      <span class="hljs-string">"courseUploadDate"</span>: <span class="hljs-string">"2021-09-01T13:09:42.000Z"</span>,
      <span class="hljs-string">"courseDateRestriction"</span>: <span class="hljs-literal">null</span>,
      <span class="hljs-string">"courseOwnerId"</span>: <span class="hljs-number">4</span>,
      <span class="hljs-string">"courseOwnerFirst"</span>: <span class="hljs-string">"Louis"</span>,
      <span class="hljs-string">"courseOwnerLast"</span>: <span class="hljs-string">"Kendem"</span>,
      <span class="hljs-string">"courseTopics"</span>: [],
      <span class="hljs-string">"courseSectionsInfo"</span>: [],
      <span class="hljs-string">"courseLastUpdate"</span>: <span class="hljs-string">"2021-09-01T13:27:00.000Z"</span>,
      <span class="hljs-string">"isEnrolled"</span>: <span class="hljs-literal">false</span>
courseId: <span class="hljs-built_in">number</span>
courseTitle: <span class="hljs-built_in">string</span>
courseDescription: <span class="hljs-built_in">string</span>
courseIsprivate: <span class="hljs-built_in">boolean</span>
courseUploadDate: <span class="hljs-built_in">string</span>          <span class="hljs-comment">// UTC</span>
courseDateRestriction: <span class="hljs-built_in">string</span>     <span class="hljs-comment">// UTC</span>
courseOwnerId: <span class="hljs-built_in">number</span>
courseOwnerFirst: <span class="hljs-built_in">string</span>
courseOwnerLast: <span class="hljs-built_in">string</span>
courseTopics: {
  topicId: <span class="hljs-built_in">number</span>
  topicName: <span class="hljs-built_in">number</span>
}[]
courseSectionsInfo: {
  sectionId: <span class="hljs-built_in">number</span>
  sectionDescription: <span class="hljs-built_in">string</span>
  sectionOrder: <span class="hljs-built_in">number</span>
  sectionUploadDate: <span class="hljs-built_in">string</span>       <span class="hljs-comment">// UTC</span>
  sectionDateRestriction: <span class="hljs-built_in">string</span>  <span class="hljs-comment">// UTC</span>
}[]
courseLastUpdate: <span class="hljs-built_in">string</span>          <span class="hljs-comment">// UTC</span>
isEnrolled: <span class="hljs-literal">false</span>
}
</div></code></pre>
<h4 id="delete-course-delete-coursescourseid"><strong>DELETE
    COURSE</strong>     <code>DELETE /courses/:courseId</code></h4>
<p><em>This endpoint is reserved to teachers owning the course to be deleted.</em></p>
<p>Deleting a course will mark its database item and subsequent sections and lessons as deleted instead of actually
  discarding them. A reinstate endpoint will soon be implemented.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// RESPONSE</span>
{
affectedRows: <span class="hljs-built_in">number</span>
insertId: <span class="hljs-number">0</span>
warningStatus: <span class="hljs-built_in">number</span>
}
</div></code></pre>
<p><em>We are aware that disclosing the actual MariaDB response is a potential security concern, this will be changed
    soon.</em></p>
<br />
<br />
<br />
<br />
<h3 id="course-permissions"><strong>COURSE PERMISSIONS</strong></h3>
<h4 id="get-permissions-get-coursescourseidpermissions"><strong>GET
    PERMISSIONS</strong>     <code>GET /courses/:courseId/permissions</code></h4>
<p><em>This endpoint is reserved to teachers owning the course.</em></p>
<p>Returns a list of enrolled students.</p>
<pre class="hljs"><code><div>{
userId: <span class="hljs-built_in">number</span>
email: <span class="hljs-built_in">string</span>
firstName: <span class="hljs-built_in">string</span>
lastName: <span class="hljs-built_in">string</span>
birthdate: <span class="hljs-built_in">string</span>           <span class="hljs-comment">// UTC</span>
registrationDate: <span class="hljs-built_in">string</span>    <span class="hljs-comment">// UTC</span>
role: <span class="hljs-string">'teacher'</span> | <span class="hljs-string">'student'</span>
}[]
</div></code></pre>
<h4 id="add-permissions-post-coursescourseidpermissions"><strong>ADD
    PERMISSIONS</strong>     <code>POST /courses/:courseId/permissions</code></h4>
<p><em>This endpoint is reserved to teachers owning the course.</em></p>
<p>Allows teachers to enroll students by providing an array of ids.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>

{
users: <span class="hljs-built_in">number</span>[]
}

<span class="hljs-comment">// RESPONSE</span>

{
ok: <span class="hljs-built_in">number</span>[]
failed: <span class="hljs-built_in">number</span>[]
}
</div></code></pre>
<h4 id="remove-permissions-delete-coursescourseidpermissions"><strong>REMOVE
    PERMISSIONS</strong>     <code>DELETE /courses/:courseId/permissions</code></h4>
<p><em>This endpoint is reserved to teachers owning the course.</em></p>
<p>Allows teachers to unenroll students by providing an array of ids.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>

{
users: <span class="hljs-built_in">number</span>[]
}

<span class="hljs-comment">// RESPONSE</span>

{
ok: <span class="hljs-built_in">number</span>[]
failed: <span class="hljs-built_in">number</span>[]
}
</div></code></pre>
<p>A compromise had to be made on the responses for both add and remove permissions. If some ids fail to be added or
  removed and still some succeed, the HTTP code will remain <code>200</code> or <code>201</code>.</p>
<h3 id="course-self-enroll"><strong>COURSE SELF-ENROLL</strong></h3>
<h4 id="post-self-enroll-post-coursescourseidselfenroll"><strong>POST
    SELF-ENROLL</strong>     <code>POST /courses/:courseId/selfenroll</code></h4>
<p><em>This enpoint is reserved to logged users.</em></p>
<p>Allows users to enroll themselves in public courses. The user id and course id are taken from the token and the url
  parameter <code>:courseId</code>.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// RESPONSE</span>
{
affectedRows: <span class="hljs-built_in">number</span>
insertId: <span class="hljs-number">0</span>
warningStatus: <span class="hljs-built_in">number</span>
}
</div></code></pre>
<h4 id="delete-self-enroll-delete-coursescourseidselfenroll"><strong>DELETE
    SELF-ENROLL</strong>     <code>DELETE /courses/:courseId/selfenroll</code></h4>
<p><em>This enpoint is reserved to logged users.</em></p>
<p>Allows users to unenroll themselves in public courses. The user id and course id are taken from the token and the
  url parameter <code>:courseId</code>.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// RESPONSE</span>
{
affectedRows: <span class="hljs-built_in">number</span>
insertId: <span class="hljs-number">0</span>
warningStatus: <span class="hljs-built_in">number</span>
}
</div></code></pre>
<h3 id="course-progress"><strong>COURSE PROGRESS</strong></h3>
<h4 id="get-progress-get-coursescourseidprogress"><strong>GET
    PROGRESS</strong>     <code>GET /courses/:courseId/progress</code></h4>
<p><em>This enpoint is reserved to logged users enrolled in the concerned course.</em></p>
<p>Allows user to consult what lessons they have completed in a course. The userId is taken from the token.</p>
<pre class="hljs"><code><div>{
userId: <span class="hljs-built_in">number</span>
courseId: <span class="hljs-built_in">number</span>
completeLessons: <span class="hljs-built_in">number</span>
completeLessonIds: <span class="hljs-built_in">number</span>[]
}
</div></code></pre>
<p>*For the edition of progress stats, refer to the Lessons endpoints.</p>
<h3 id="course-topics"><strong>COURSE TOPICS</strong></h3>
<h4 id="put-topics-put-coursescourseidtopics"><strong>PUT
    TOPICS</strong>     <code>PUT /courses/:courseId/topics</code></h4>
<p><em>This enpoint is reserved to the owner of the course.</em></p>
<p>Allows the edition of the topics related of a course. A <code>PUT</code> request is used for both removing and
  adding topics.</p>
<p>The request object must bear all the topic ids to be added in an array. The response will bear the topics of the
  course (id and name).</p>
<p><em>For a list of topics, please refer to the topic endpoint.</em></p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>

{
topics: <span class="hljs-built_in">number</span>[]
}

<span class="hljs-comment">// RESPONSE</span>

{
topicId: <span class="hljs-built_in">number</span>
topicName: <span class="hljs-built_in">string</span>
}
</div></code></pre>
<h3 id="sections-coursescourseid"><strong>SECTIONS</strong>     <code>/courses/:courseId</code></h3>
<p><em>The endpoints below are restricted to the owner of a course and its enrolled students, and other teachers.</em>
</p>
<h4 id="get-sections-get-sections"><strong>GET SECTIONS</strong>     <code>GET /sections</code></h4>
<p>Returns information on the sections of a course (without the lessons).</p>
<pre class="hljs"><code><div>{
sectionId: <span class="hljs-built_in">number</span>
sectionTitle: <span class="hljs-built_in">string</span>
sectionDescription: <span class="hljs-built_in">string</span>
sectionUploadDate: <span class="hljs-built_in">string</span>
sectionOwnerId: <span class="hljs-built_in">number</span>
sectionDateRestriction: <span class="hljs-built_in">string</span>
sectionOwnerFirst: <span class="hljs-built_in">string</span>
sectionOwnerLast: <span class="hljs-built_in">string</span>
sectionLastUpdate: <span class="hljs-built_in">string</span>
sectionOrder: <span class="hljs-built_in">number</span>
}
</div></code></pre>
<h4 id="get-section-by-id-get-sectionssectionid"><strong>GET SECTION BY
    ID</strong>     <code>GET /sections/:sectionId</code></h4>
<p>Returns information on a particular section and its content.</p>
<pre class="hljs"><code><div>{
sectionId: <span class="hljs-built_in">number</span>;
sectionTitle: <span class="hljs-built_in">string</span>;
sectionDescription: <span class="hljs-built_in">string</span>;
sectionUploadDate: <span class="hljs-built_in">string</span>;
sectionOwnerId: <span class="hljs-built_in">number</span>;
sectionDateRestriction: <span class="hljs-built_in">string</span>;
sectionOwnerFirst: <span class="hljs-built_in">string</span>;
sectionOwnerLast: <span class="hljs-built_in">string</span>;
sectionLastUpdate: <span class="hljs-built_in">string</span>;
sectionOrder: <span class="hljs-built_in">number</span>;
sectionLessonsInfo: {
  lessonId: <span class="hljs-built_in">number</span>;
  lessonTitle: <span class="hljs-built_in">string</span>;
  lessonDescription: <span class="hljs-built_in">string</span>;
  lessonUploadDate: <span class="hljs-built_in">string</span>;
  lessonOrder: <span class="hljs-built_in">number</span>;
  lessonDate: <span class="hljs-built_in">string</span> | <span class="hljs-literal">null</span>;
}
</div></code></pre>
<h4 id="post-section-post-sections"><strong>POST SECTION</strong>     <code>POST /sections/</code></h4>
<p><em>This endpoint is reserved to teachers.</em></p>
<p>Allows teachers to create sections within a course by providing at least a title, description and order. A
  restriction date can be added, students won't have access until the date has passed.</p>
<pre class="hljs"><code><div><span class="hljs-comment">//REQUEST</span>

{
sectionTitle: <span class="hljs-built_in">string</span>;
sectionDescription: <span class="hljs-built_in">string</span>;
sectionOrder: <span class="hljs-built_in">number</span>;
sectionDateRestriction?: <span class="hljs-built_in">string</span>;
}

<span class="hljs-comment">// RESPONSE</span>

{
sectionId: <span class="hljs-built_in">string</span>
sectionTitle: <span class="hljs-built_in">string</span>
sectionDescription: <span class="hljs-built_in">string</span>
sectionOrder: <span class="hljs-built_in">string</span>
sectionOwnerId: <span class="hljs-built_in">string</span>
sectionCourseId: <span class="hljs-built_in">string</span>
sectionDateRestriction?: <span class="hljs-built_in">string</span>;      <span class="hljs-comment">// UTC format</span>
}
</div></code></pre>
<h4 id="put-section-put-sectionssectionid"><strong>PUT SECTION</strong>     <code>PUT /sections/:sectionId</code></h4>
<p><em>This endpoint is reserved to the teacher owner of the course.</em></p>
<p>Allows the edition of a section. The restriction can be added, modified, or removed. The reject will be rejected if
  no modification is made.</p>
<pre class="hljs"><code><div><span class="hljs-comment">//REQUEST</span>

{
sectionTitle?: <span class="hljs-built_in">string</span>;
sectionDescription?: <span class="hljs-built_in">string</span>;
sectionOrder?: <span class="hljs-built_in">number</span>;
sectionDateRestriction?: <span class="hljs-built_in">string</span> | <span class="hljs-literal">null</span>;   <span class="hljs-comment">// UTC format</span>
}

<span class="hljs-comment">// RESPONSE</span>

{
sectionId: <span class="hljs-built_in">number</span>
sectionTitle: <span class="hljs-built_in">string</span>
sectionDescription: <span class="hljs-built_in">string</span>
sectionOwnerId: <span class="hljs-built_in">number</span>
sectionUploadDate: <span class="hljs-built_in">string</span>                   <span class="hljs-comment">// UTC format</span>
sectionDateRestriction: <span class="hljs-built_in">string</span> | <span class="hljs-literal">null</span>       <span class="hljs-comment">// UTC format</span>
sectionLastUpdate: <span class="hljs-built_in">string</span>                   <span class="hljs-comment">// UTC format</span>
sectionOwnerFirst: <span class="hljs-built_in">string</span>
sectionOwnerLast: <span class="hljs-built_in">string</span>
sectionOrder: <span class="hljs-built_in">number</span>
sectionLessonsInfo: {
  lessonId: <span class="hljs-built_in">number</span>;
  lessonTitle: <span class="hljs-built_in">string</span>;
  lessonDescription: <span class="hljs-built_in">string</span>;
  lessonOrder: <span class="hljs-built_in">number</span>;
  lessonUploadDate: <span class="hljs-built_in">string</span>;                 <span class="hljs-comment">//UTC format</span>
  lessonDate: <span class="hljs-built_in">string</span> | <span class="hljs-literal">null</span>;                <span class="hljs-comment">// UTC format</span>
}
}
</div></code></pre>
<h4 id="delete-section-delete-sectionssectionid"><strong>DELETE
    SECTION</strong>     <code>DELETE /sections/:sectionId</code></h4>
<p><em>This endpoint is reserved to the teacher owner of the course.</em></p>
<p>Marks the section as deleted in the database, but the data remains. All related lessons are set to deleted as well.
</p>
<pre class="hljs"><code><div>{
affectedRows: <span class="hljs-built_in">number</span>
insertId: <span class="hljs-number">0</span>
warningStatus: <span class="hljs-built_in">number</span>
}
</div></code></pre>
<h3 id="lessons"><strong>LESSONS</strong></h3>
<h4 id="get-all-lessons-get-coursescourseidsectionssectionidlessons"><strong>GET ALL
    LESSONS</strong>     <code>GET /courses/:courseId/sections/:sectionId/lessons</code></h4>
<p>This endpoint will return a list of all the lessons that pertain to the coresponding course and section, based on
  the permission level of the client.</p>
<p>This endpoint is restricted to logged users. Teachers can access lessons in courses they own and are enrolled in.
  Students can access lessons in public courses and private courses they are enrolled in.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>
{

}

<span class="hljs-comment">// RESPONSE</span>
{
lessonId: <span class="hljs-built_in">number</span>
lessonTitle: <span class="hljs-built_in">string</span>
lessonDescription: <span class="hljs-built_in">string</span>
lessonOrder: <span class="hljs-built_in">number</span>
lessonUploadDate: <span class="hljs-built_in">string</span>
lessonDate: <span class="hljs-built_in">string</span>
lessonContent: <span class="hljs-built_in">string</span>
lessonIsDeleted: <span class="hljs-number">1</span> | <span class="hljs-number">0</span>
lessonSectionId: <span class="hljs-built_in">number</span>
courseOwnerId: <span class="hljs-built_in">number</span>
}
</div></code></pre>
<h4 id="get-lesson-by-id-get-coursescourseidsectionssectionidlessonslessonid"><strong>GET LESSON BY
    ID</strong>     <code>GET /courses/:courseId/sections/:sectionId/lessons/:lessonId</code></h4>
<p>This endpoint will return a object that contains lesson infromation pertaining to the coresponding course and
  section.</p>
<p>This endpoint is restricted logged users. Teachers can access lessons in courses they own and are enrolled in.
  Students can access lessons in public courses and private courses they are enrolled in.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>
{

}

<span class="hljs-comment">// RESPONSE</span>
{
lessonId: <span class="hljs-built_in">number</span>
lessonTitle: <span class="hljs-built_in">string</span>
lessonDescription: <span class="hljs-built_in">string</span>
lessonOrder: <span class="hljs-built_in">number</span>
lessonUploadDate: <span class="hljs-built_in">string</span>
lessonDate: <span class="hljs-built_in">string</span>
lessonLastUpdate: <span class="hljs-built_in">string</span>
lessonContent: <span class="hljs-built_in">string</span>
lessonIsDeleted: <span class="hljs-number">1</span> | <span class="hljs-number">0</span>
lessonSectionId: <span class="hljs-built_in">number</span>
courseOwnerId: <span class="hljs-built_in">number</span>
}
</div></code></pre>
<h4 id="create-lesson-post-coursescourseidsectionssectionidlessons"><strong>CREATE
    LESSON</strong>     <code>POST /courses/:courseId/sections/:sectionId/lessons</code></h4>
<p>This endpoint will create a new lesson record that pertains to the coresponding course and section, based on the
  permission level of the client.</p>
<p>This endpoint is restricted to teachers that own the course they are modifying.</p>
<p>The lesson description can be typed in as a normal string or in markdown language and is converted into an HTML
  string by the form.</p>
<p>The lesson content is separated into a body and iFrames. The body contains the main part of the lesson's content,
  represented by an HTML string. The iFrames are additional attachments (such as embedded links to documents and
  videos) represented by an array of HTML strings.</p>
<p>Since this is custom HTML, potential problematic tags are eliminated by an HTML sanitizer (NPM package
  <strong>sanitize-html</strong>). Its default settings are :
</p>
<pre class="hljs"><code><div>allowedTags: [
<span class="hljs-string">"address"</span>, <span class="hljs-string">"article"</span>, <span class="hljs-string">"aside"</span>, <span class="hljs-string">"footer"</span>, <span class="hljs-string">"header"</span>, <span class="hljs-string">"h1"</span>, <span class="hljs-string">"h2"</span>, <span class="hljs-string">"h3"</span>, <span class="hljs-string">"h4"</span>,
<span class="hljs-string">"h5"</span>, <span class="hljs-string">"h6"</span>, <span class="hljs-string">"hgroup"</span>, <span class="hljs-string">"main"</span>, <span class="hljs-string">"nav"</span>, <span class="hljs-string">"section"</span>, <span class="hljs-string">"blockquote"</span>, <span class="hljs-string">"dd"</span>, <span class="hljs-string">"div"</span>,
<span class="hljs-string">"dl"</span>, <span class="hljs-string">"dt"</span>, <span class="hljs-string">"figcaption"</span>, <span class="hljs-string">"figure"</span>, <span class="hljs-string">"hr"</span>, <span class="hljs-string">"li"</span>, <span class="hljs-string">"main"</span>, <span class="hljs-string">"ol"</span>, <span class="hljs-string">"p"</span>, <span class="hljs-string">"pre"</span>,
<span class="hljs-string">"ul"</span>, <span class="hljs-string">"a"</span>, <span class="hljs-string">"abbr"</span>, <span class="hljs-string">"b"</span>, <span class="hljs-string">"bdi"</span>, <span class="hljs-string">"bdo"</span>, <span class="hljs-string">"br"</span>, <span class="hljs-string">"cite"</span>, <span class="hljs-string">"code"</span>, <span class="hljs-string">"data"</span>, <span class="hljs-string">"dfn"</span>,
<span class="hljs-string">"em"</span>, <span class="hljs-string">"i"</span>, <span class="hljs-string">"kbd"</span>, <span class="hljs-string">"mark"</span>, <span class="hljs-string">"q"</span>, <span class="hljs-string">"rb"</span>, <span class="hljs-string">"rp"</span>, <span class="hljs-string">"rt"</span>, <span class="hljs-string">"rtc"</span>, <span class="hljs-string">"ruby"</span>, <span class="hljs-string">"s"</span>, <span class="hljs-string">"samp"</span>,
<span class="hljs-string">"small"</span>, <span class="hljs-string">"span"</span>, <span class="hljs-string">"strong"</span>, <span class="hljs-string">"sub"</span>, <span class="hljs-string">"sup"</span>, <span class="hljs-string">"time"</span>, <span class="hljs-string">"u"</span>, <span class="hljs-string">"var"</span>, <span class="hljs-string">"wbr"</span>, <span class="hljs-string">"caption"</span>,
<span class="hljs-string">"col"</span>, <span class="hljs-string">"colgroup"</span>, <span class="hljs-string">"table"</span>, <span class="hljs-string">"tbody"</span>, <span class="hljs-string">"td"</span>, <span class="hljs-string">"tfoot"</span>, <span class="hljs-string">"th"</span>, <span class="hljs-string">"thead"</span>, <span class="hljs-string">"tr"</span>
],
disallowedTagsMode: <span class="hljs-string">'discard'</span>,
allowedAttributes: {
a: [ <span class="hljs-string">'href'</span>, <span class="hljs-string">'name'</span>, <span class="hljs-string">'target'</span> ],
},
selfClosing: [ <span class="hljs-string">'img'</span>, <span class="hljs-string">'br'</span>, <span class="hljs-string">'hr'</span>, <span class="hljs-string">'area'</span>, <span class="hljs-string">'base'</span>, <span class="hljs-string">'basefont'</span>, <span class="hljs-string">'input'</span>, <span class="hljs-string">'link'</span>, <span class="hljs-string">'meta'</span> ],
<span class="hljs-comment">// URL schemes we permit</span>
allowedSchemes: [ <span class="hljs-string">'http'</span>, <span class="hljs-string">'https'</span>, <span class="hljs-string">'ftp'</span>, <span class="hljs-string">'mailto'</span>, <span class="hljs-string">'tel'</span> ],
allowedSchemesByTag: {},
allowedSchemesAppliedToAttributes: [ <span class="hljs-string">'href'</span>, <span class="hljs-string">'src'</span>, <span class="hljs-string">'cite'</span> ],
allowProtocolRelative: <span class="hljs-literal">true</span>,
enforceHtmlBoundary: <span class="hljs-literal">false</span>
</div></code></pre>
<p>In addition to the default settings, the lesson body are filtered with the following settings:</p>
<pre class="hljs"><code><div>allowedTags: [<span class="hljs-string">"img"</span>],
allowediFrameAttributes = [<span class="hljs-string">'src'</span>]; <span class="hljs-comment">// the src url is checked for safety</span>
</div></code></pre>
<p>In addition to the default settings, the lesson Iframes are filtered with the following settings:</p>
<pre class="hljs"><code><div>allowedTags: [
<span class="hljs-string">"iframe"</span>
],
allowediFrameAttributes = [
<span class="hljs-string">'src'</span>,
<span class="hljs-string">'style'</span>,
<span class="hljs-string">'width'</span>,
<span class="hljs-string">'height'</span>,
<span class="hljs-string">'title'</span>,
<span class="hljs-string">'frameborder'</span>,
<span class="hljs-string">'allow'</span>,
<span class="hljs-string">'autoplay'</span>,
<span class="hljs-string">'clipboard-write'</span>,
<span class="hljs-string">'encrypted-media'</span>,
<span class="hljs-string">'gyroscope'</span>,
<span class="hljs-string">'picture-in-picture'</span>,
<span class="hljs-string">'allowfullscreen'</span>,
<span class="hljs-string">'order'</span>,
<span class="hljs-string">'orientation'</span>,
];
</div></code></pre>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>
{
lessonTitle: <span class="hljs-built_in">string</span>
lessonDescription: <span class="hljs-built_in">string</span>
lessonOrder: <span class="hljs-built_in">number</span>
lessonDate: <span class="hljs-built_in">string</span>
lessonContent: {
  body: <span class="hljs-built_in">string</span>
  iframes: <span class="hljs-built_in">string</span>[]             <span class="hljs-comment">// iframes can be an empty array, but a body is necessary</span>
}
}

<span class="hljs-comment">// RESPONSE</span>
{
lessonId: <span class="hljs-built_in">number</span>
lessonTitle: <span class="hljs-built_in">string</span>
lessonDescription: <span class="hljs-built_in">string</span>
lessonOrder: <span class="hljs-built_in">number</span>
lessonDate: <span class="hljs-built_in">string</span>
lessonContent: {
  body: <span class="hljs-built_in">string</span>
  iframes: <span class="hljs-built_in">string</span>[]
}
lessonSectionId: <span class="hljs-built_in">number</span>
}
</div></code></pre>
<h4 id="update-lesson-put-coursescourseidsectionssectionidlessonslessonid"><strong>UPDATE
    LESSON</strong>     <code>PUT /courses/:courseId/sections/:sectionId/lessons/:lessonId</code></h4>
<p>TThis endpoint will update a lesson record that corresponds to the specified course, section, and lesson ID number.
  The field that is to be changed is sent in the request along with its desired new data.</p>
<p>This endpoint is restricted to teachers that own the course they are modifying.</p>
<p>The lesson content is separated into a body and iFrames. The body contains the main part of the lesson's content,
  represented by an HTML string. The iFrames are additional attachments (such as embedded links to documents and
  videos) represented by an array of HTML strings. The HTML sanitizer settings mentioned above still apply.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>
{
lessonTitle?: <span class="hljs-built_in">string</span>
lessonDescription?: <span class="hljs-built_in">string</span>
lessonOrder?: <span class="hljs-built_in">number</span>
lessonDate?: <span class="hljs-built_in">string</span>
lessonContent?: {
  body: <span class="hljs-built_in">string</span>
  iframes: <span class="hljs-built_in">string</span>[]
}
lessonSectionId?: <span class="hljs-built_in">number</span>
}

<span class="hljs-comment">// RESPONSE</span>
{
lessonId: <span class="hljs-built_in">number</span>
lessonTitle: <span class="hljs-built_in">string</span>
lessonDescription: <span class="hljs-built_in">string</span>
lessonOrder: <span class="hljs-built_in">number</span>
lessonDate: <span class="hljs-built_in">string</span>
lessonContent: {
  body: <span class="hljs-built_in">string</span>
  iframes: <span class="hljs-built_in">string</span>[]
}
lessonSectionId: <span class="hljs-built_in">number</span>
lessonId: <span class="hljs-built_in">number</span>
courseOwnerId: <span class="hljs-built_in">number</span>
}
</div></code></pre>
<h4 id="delete-lesson-delete-coursescourseidsectionssectionidlessonslessonid"><strong>DELETE
    LESSON</strong>     <code>DELETE /courses/:courseId/sections/:sectionId/lessons/:lessonId</code></h4>
<p>This endpoint will delete a lesson record that corresponds to the specified course, section, and lesson ID number.
  Users that have marked this lesson complete will also have their course progress updated accordingly.</p>
<p>This endpoint is restricted to teachers that own the course they are modifying.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>
{

}

<span class="hljs-comment">// RESPONSE</span>
{
affectedRows: <span class="hljs-built_in">number</span>
insertId: <span class="hljs-built_in">number</span>
warningStatus: <span class="hljs-built_in">number</span>
}
</div></code></pre>
<h4 id="mark-lesson-as-complete-post-coursescourseidsectionssectionidlessonslessonidcomplete"><strong>MARK LESSON AS
    COMPLETE</strong>     <code>POST /courses/:courseId/sections/:sectionId/lessons/:lessonId/complete</code></h4>
<p>This endpoint will mark a lesson as complete, affecting the requester's course progress.</p>
<p>This endpoint is restricted to students that are enrolled in the course they are modifying.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>
{

}

<span class="hljs-comment">// RESPONSE</span>
{
affectedRows: <span class="hljs-built_in">number</span>
insertId: <span class="hljs-built_in">number</span>
warningStatus: <span class="hljs-built_in">number</span>
}
</div></code></pre>
<h4 id="mark-lesson-as-incomplete-delete-coursescourseidsectionssectionidlessonslessonidincomplete"><strong>MARK
    LESSON AS
    INCOMPLETE</strong>     <code>DELETE /courses/:courseId/sections/:sectionId/lessons/:lessonId/incomplete</code>
</h4>
<p>This endpoint will mark a lesson as incomplete, affecting the requester's course progress.</p>
<p>This endpoint is restricted to students that are enrolled in the course they are modifying.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>
{

}

<span class="hljs-comment">// RESPONSE</span>
{
affectedRows: <span class="hljs-built_in">number</span>
insertId: <span class="hljs-built_in">number</span>
warningStatus: <span class="hljs-built_in">number</span>
}
</div></code></pre>
<h3 id="announcements"><strong>ANNOUNCEMENTS</strong></h3>
<h4 id="get-all-course-announcements-get-coursescourseidannouncements"><strong>GET ALL COURSE
    ANNOUNCEMENTS</strong>     <code>GET /courses/:courseId/announcements</code></h4>
<p>This endpoint will return a list of all the announcements that belong to the coresponding course.</p>
<p>This endpoint is restricted logged users. Teachers can access announcements in courses they own and are enrolled
  in. Students can access announcements in public courses and private courses they are enrolled in.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>
{

}

<span class="hljs-comment">// RESPONSE</span>
{
announcementId: <span class="hljs-built_in">number</span>
announcementTitle: <span class="hljs-built_in">string</span>
announcementContent: <span class="hljs-built_in">string</span>
announcementCourseId: <span class="hljs-built_in">number</span>
announcementUploadDate: <span class="hljs-built_in">Date</span>
}
</div></code></pre>
<h4 id="get-announcement-get-coursescourseidannouncementsannouncementid"><strong>GET
    ANNOUNCEMENT</strong>     <code>GET /courses/:courseId/announcements/:announcementId</code></h4>
<p>This endpoint will return the corresponding announcement specified by the given ID.</p>
<p>This endpoint is restricted to logged users. Teachers can access announcements in courses they own and are enrolled
  in. Students can access announcements in public courses and private courses they are enrolled in.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>
{

}

<span class="hljs-comment">// RESPONSE</span>
{
announcementId: <span class="hljs-built_in">number</span>
announcementTitle: <span class="hljs-built_in">string</span>
announcementContent: <span class="hljs-built_in">string</span>
announcementCourseId: <span class="hljs-built_in">number</span>
announcementUploadDate: <span class="hljs-built_in">Date</span>
}
</div></code></pre>
<h4 id="update-announcement-put-coursescourseidannouncementsannouncementid"><strong>UPDATE
    ANNOUNCEMENT</strong>     <code>PUT /courses/:courseId/announcements/:announcementId</code></h4>
<p>This endpoint will update the corresponding announcement specified by the given ID.</p>
<p>This endpoint is restricted to logged users. Teachers can access announcements in courses they own and are enrolled
  in. Students can access announcements in public courses and private courses they are enrolled in.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>
{
announcementId: <span class="hljs-built_in">number</span>
announcementTitle: <span class="hljs-built_in">string</span>
announcementContent: <span class="hljs-built_in">string</span>
announcementCourseId: <span class="hljs-built_in">number</span>
announcementUploadDate: <span class="hljs-built_in">Date</span>
}

<span class="hljs-comment">// RESPONSE</span>
{
announcementId: <span class="hljs-built_in">number</span>
announcementTitle: <span class="hljs-built_in">string</span>
announcementContent: <span class="hljs-built_in">string</span>
announcementCourseId: <span class="hljs-built_in">number</span>
announcementUploadDate: <span class="hljs-built_in">Date</span>
}
</div></code></pre>
<h4 id="delete-announcement-delete-coursescourseidannouncementsannouncementid"><strong>DELETE
    ANNOUNCEMENT</strong>     <code>DELETE /courses/:courseId/announcements/:announcementId</code></h4>
<p>This endpoint will delete the corresponding announcement specified by the given ID.</p>
<p>This endpoint is restricted to logged users. Teachers can access announcements in courses they own and are enrolled
  in. Students can access announcements in public courses and private courses they are enrolled in.</p>
<pre class="hljs"><code><div><span class="hljs-comment">// REQUEST</span>
{

}

<span class="hljs-comment">// RESPONSE</span>
{
announcementId: <span class="hljs-built_in">number</span>
}
</div></code></pre>
<h3 id="topics-topics"><strong>TOPICS</strong>     <code>/topics/</code></h3>
<h4 id="get-all-topics-get-topics"><strong>GET ALL TOPICS</strong>     <code>GET /topics</code></h4>
<p><em>This end point is public.</em></p>
<p>Anyone can fetch a list of existing topics from our API. An array of objects made of the id and name of each topic
  will be sent.</p>
<pre class="hljs"><code><div>{
topicId: <span class="hljs-built_in">number</span>
topicName: <span class="hljs-built_in">string</span>
}[]
</div></code></pre>

</body>

</html>`;

export default documentation;
