# BENKYŌ API

The Benkyō API provides a structured and intuitive interface with our servers, enabling profile creation, authentication, and data modification.

The Benkyō API follows a simple hierarchy of content. It can be divided in two categories, which also help understanding the database schema.

Identification is implemented with the Passport middleware and its token strategy.

The API is currently planned for a reasonable amount of content and therefore pagination or filtering is up to the client.

1. [BENKYŌ API](#benkyō-api)
   1. [Definitions](#definitions)
   2. [Authentication](#authentication)
   3. [Permissions](#permissions)
   4. [Date restrictions](#date-restrictions)
   5. [Lesson date](#lesson-date)
   6. [Requests and responses](#requests-and-responses)
   7. [Dates](#dates)
   8. [Content](#content)
      1. [**AUTH**](#auth)
         1. **LOGIN**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`POST /auth
         2. **LOGOUT**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`POST /auth`
      2. [**COURSES**](#courses)
         1. **GET ALL COURSES**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses`
         2. **GET COURSE BY ID**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses/:courseId`
         3. **POST COURSE**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`POST /courses`
         4. **PUT COURSE**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`PUT /courses/:courseId`
         5. **DELETE COURSE**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`DELETE /courses/:courseId`
      3. [**COURSE PERMISSIONS**](#course-permissions)
         1. **GET PERMISSIONS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         2. **ADD PERMISSIONS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         3. **REMOVE PERMISSIONS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      4. [**COURSE SELF-ENROLL**](#course-self-enroll)
         1. **POST SELF-ENROLL**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         2. **DELETE SELF-ENROLL**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      5. [**COURSE PROGRESS**](#course-progress)
         1. **GET PROGRESS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses/:courseId/progress`
      6. [**COURSE TOPICS**](#course-topics)
         1. **PUT TOPICS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`PUT /courses/:courseId/topics`
      7. [**SECTIONS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`/courses/:courseId`](#sectionscoursescourseid)
         1. **GET SECTIONS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /sections`
         2. **GET SECTION BY ID**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /sections/:sectionId`
         3. **POST SECTION**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`POST /sections/`
         4. **PUT SECTION**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`PUT /sections/:sectionId`
         5. **DELETE SECTION**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`DELETE /sections/:sectionId`
      8. [**LESSONS**](#lessons)
         1. **GET ALL LESSONS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses/:courseId/sections/:sectionId/lessons`
         2. **GET LESSON BY ID**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses/:courseId/sections/:sectionId/lessons/:lessonId`
         3. **CREATE LESSON**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`POST /courses/:courseId/sections/:sectionId/lessons`
         4. **UPDATE LESSON**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`PUT /courses/:courseId/sections/:sectionId/lessons/:lessonId`
         5. **DELETE LESSON**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`DELETE /courses/:courseId/sections/:sectionId/lessons/:lessonId`
         6. **MARK LESSON AS COMPLETE**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`POST /courses/:courseId/sections/:sectionId/lessons/:lessonId/complete`
         7. **MARK LESSON AS INCOMPLETE**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`DELETE /courses/:courseId/sections/:sectionId/lessons/:lessonId/incomplete`
      9. [**ANNOUNCEMENTS**](#announcements)
         1. **GET ALL COURSE ANNOUNCEMENTS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses/:courseId/announcements`
         2. **GET ANNOUNCEMENT**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses/:courseId/announcements/:announcementId`
         3. **UPDATE ANNOUNCEMENT**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`PUT /courses/:courseId/announcements/:announcementId`
         4. **DELETE ANNOUNCEMENT**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`DELETE /courses/:courseId/announcements/:announcementId`
      10. [**TOPICS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`/topics/`](#topicstopics)
         5. **GET ALL TOPICS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /topics`

## Definitions

- **Username**:   
  Refers to the email address.  
    
- **Role**:  
  Users can be either anonymous, students, or teachers. Although anyone is free to create a Benkyō account, the teacher status is reserved.   
  
- **Privacy**: 
  Defines whether the course is public or private with a boolean value (`false` for public, `true` for private).  
- **Enrollment**:  
  Teachers can enroll students into their courses. Only enrolled students are able to access the content of a course.  
- **Self-enrollement**:  
  When a user visits a course (public if student and any if teacher), they are de facto enrolled in that course.
  Teachers have visibility on these self-enrolled enrolled as well.

## Authentication

If provided with a valid username (email address) and password, the API will return a token with the following information: user id, email, first name, last name, role.

Please use a bearer token authentication in your HTTP requests.

When a user logs in, their token is stored in the database as an implementation of white listing. Every request submitted with a token will have its authenticity verified by looking the database for an equal token.

Upon logout, the token is deleted from the database and any further request containing this token will be rejected.

## Permissions

Their are 5 levels of permissions in Benkyō, based on the role and the relation of the client to the requested resource:
- **anonymous** users
- **unenrolled logged users** (relatively to a course)
- **enrolled logged users** (idem)
- **teachers** (idem)
- **owner teacher** (idem)

The content of most responses to GET requests adjusts to the permissions of the client.

## Date restrictions

By setting date restrictions on courses and sections, teachers can restrict their content for a definite time. Those restrictions do not apply to students with the role of teacher.

## Lesson date

Teachers can specify a date and time on which the lesson will be held.

## Requests and responses

Following the REST specifications, requests are stateless and must embed all the information necessary to their completion. GET and DELETE requests mostly find their information in the URL parameters, POST and PUT in the request body.

Responses follow a unified format which allows for simple success check and data handling.
```ts
{
  errorCode: number || null,
  data: any,
}
```

Error codes **are** single-digit integers, semantically overlapping with HTTP codes but widening the checking possibilities of the client.

**NB** the response formats presented below will always be stored in the `data` field of the response body.

## Dates

Dates should be sent in UTC format (or RFC 3339). The same format will be used in responses.

## Content

The content comprises courses, sections and lessons, nested in that order.

Creating, updating and deleting any of those resources is stricly reserved to users benefitting of the teacher role.

Courses, sections and lessons have in the common the following fields:

<style type="text/css">
.tg  {border-collapse:collapse;border-color:#aaa;border-spacing:0;margin:0px auto;}
.tg td{background-color:#fff;border-color:#aaa;border-style:solid;border-width:1px;color:#333;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#f38630;border-color:#aaa;border-style:solid;border-width:1px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-oe15{background-color:#ffffff;border-color:#ffffff;text-align:left;vertical-align:top}
.tg .tg-zv4m{border-color:#ffffff;text-align:left;vertical-align:top}
.tg .tg-w25z{background-color:#ffce93;border-color:#ffffff;text-align:center;vertical-align:top}
.tg .tg-8jgo{border-color:#ffffff;text-align:center;vertical-align:top}
</style>
<table class="tg" style="undefined;table-layout: fixed; width: 766px">
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

\* The content of a lesson is stored as a stringified JSON object: 
```ts
{
  body: string        // HTML content, no iframes or scripts
  iframes: string[]   // iframes with attributes, see below
} 
```


### **AUTH**

#### **LOGIN**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`POST /auth`

Any registered user can log in by sending a request containing their email and password. If the credentials match that in the database, a token will be issued with a validity of one day.

```ts
// REQUEST

{
  email: string
  password: string
}

// RESPONSE

string      // The token string is the direct value of the data key of the response object
```

#### **LOGOUT**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`POST /auth`

Logging out is realised by sending a bodyless `DELETE` request to the API.

```ts

```

### **COURSES**

#### **GET ALL COURSES**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses`

This endpoint will return a list of all the courses in the database, based on the permission level of the client.

Anonymous users have access to **public** courses **without** section information.
 
```ts
// ANONYMOUS USER (only public courses*)
{
  courseId: number,
  courseTitle: string,
  courseDescription: string,
  courseIsprivate: false*,
  courseUploadDate: string,
  courseOwnerId: number,
  courseDateRestriction: string,
  courseOwnerFirst: string,
  courseOwnerLast: string,
  courseTopics?: {
    topicId: number,
    topicName: number
    }[],
}

// LOGGED USER (both public and private courses)
{
  courseId: number,
  courseTitle: string,
  courseDescription: string,
  courseIsprivate: boolean,
  courseUploadDate: string,
  courseOwnerId: number,
  courseDateRestriction: string,
  courseOwnerFirst: string,
  courseOwnerLast: string,
  courseTopics?: {
    topicId: number,
    topicName: number
    }[],
  isEnrolled: boolean,
}
```

#### **GET COURSE BY ID**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses/:courseId`

This endpoint is restricted logged users. Teachers can access any course, students public courses and private courses they are enrolled in. The response includes the data mentioned above, as well as a summary sections of the course.

```ts
{
  courseId: number
  courseTitle: string
  courseDescription: string
  courseIsprivate: boolean
  courseUploadDate: string
  courseOwnerId: number
  courseDateRestriction: string
  courseOwnerFirst: string
  courseOwnerLast: string
  courseTopics?: CourseTopics[]
  courseLastUpdate: string
  courseSections: {
    sectionId: number
    sectionTitle: string
    sectionUploadDate: string
    sectionDateRestriction: string
    sectionOrder: number
  }
}
```

#### **POST COURSE**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`POST /courses`

*This endpoint is reserved to teachers.*

Teachers can create courses by providing at least a title, description and audience. A date restriction can be provided as well.  
The response will bear all the information related to the newly created course.

```ts
// REQUEST

{
  courseTitle: string           // 3 to 100 characters, no line breaks
  courseDescription: string     // minimum 20 characters, no line breaks
  courseIsprivate: boolean
  courseDateRestriction?: string // UTC or RFC3338
}

// RESPONSE

{
  courseId: number
  courseOwnerId: number
  courseTitle: string
  courseDescription: string
  courseIsprivate: boolean
  courseDateRestriction?: string
}
```


#### **PUT COURSE**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`PUT /courses/:courseId`

*This endpoint is reserved to teachers.*

Teachers can create courses by providing at least a title, description and audience. A date restriction can be provided as well.  
The response will bear all the information related to the newly created course.

```ts
// REQUEST

{
  courseTitle: string           // 3 to 100 characters, no line breaks
  courseDescription: string     // minimum 20 characters, no line breaks
  courseIsprivate: boolean
  courseDateRestriction?: string // UTC or RFC3338
  courseOwnerId: number
}

// RESPONSE

{
   "courseId": 97,
        "courseTitle": "A new c",
        "courseDescription": "<p>Learn it all &lt;3 We'll make great riors out of you.</p>",
        "courseIsprivate": false,
        "courseUploadDate": "2021-09-01T13:09:42.000Z",
        "courseDateRestriction": null,
        "courseOwnerId": 4,
        "courseOwnerFirst": "Louis",
        "courseOwnerLast": "Kendem",
        "courseTopics": [],
        "courseSectionsInfo": [],
        "courseLastUpdate": "2021-09-01T13:27:00.000Z",
        "isEnrolled": false
  courseId: number
  courseTitle: string
  courseDescription: string
  courseIsprivate: boolean
  courseUploadDate: string          // UTC
  courseDateRestriction: string     // UTC
  courseOwnerId: number
  courseOwnerFirst: string
  courseOwnerLast: string
  courseTopics: {
    topicId: number
    topicName: number
  }[]
  courseSectionsInfo: {
    sectionId: number
    sectionDescription: string
    sectionOrder: number
    sectionUploadDate: string       // UTC
    sectionDateRestriction: string  // UTC
  }[]
  courseLastUpdate: string          // UTC
  isEnrolled: false
}
```

#### **DELETE COURSE**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`DELETE /courses/:courseId`

*This endpoint is reserved to teachers owning the course to be deleted.*

Deleting a course will mark its database item and subsequent sections and lessons as deleted instead of actually discarding them. A reinstate endpoint will soon be implemented.

```ts
// RESPONSE
{
  affectedRows: number
  insertId: 0
  warningStatus: number
}
```

*We are aware that disclosing the actual MariaDB response is a potential security concern, this will be changed soon.*

<br/>
<br/>
<br/>
<br/>

### **COURSE PERMISSIONS**

#### **GET PERMISSIONS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses/:courseId/permissions`

*This endpoint is reserved to teachers owning the course.*

Returns a list of enrolled students.

```ts
{
  userId: number
  email: string
  firstName: string
  lastName: string
  birthdate: string           // UTC
  registrationDate: string    // UTC
  role: 'teacher' | 'student'
}[]
```

#### **ADD PERMISSIONS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`POST /courses/:courseId/permissions`

*This endpoint is reserved to teachers owning the course.*

Allows teachers to enroll students by providing an array of ids.

```ts
// REQUEST

{
  users: number[]
}

// RESPONSE

{
  ok: number[]
  failed: number[]
}
```

#### **REMOVE PERMISSIONS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`DELETE /courses/:courseId/permissions`

*This endpoint is reserved to teachers owning the course.*

Allows teachers to unenroll students by providing an array of ids.

```ts
// REQUEST

{
  users: number[]
}

// RESPONSE

{
  ok: number[]
  failed: number[]
}
```

A compromise had to be made on the responses for both add and remove permissions. If some ids fail to be added or removed and still some succeed, the HTTP code will remain `200` or `201`.

### **COURSE SELF-ENROLL**

#### **POST SELF-ENROLL**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`POST /courses/:courseId/selfenroll`

*This enpoint is reserved to logged users.*

Allows users to enroll themselves in public courses. The user id and course id are taken from the token and the url parameter `:courseId`.

```ts
// RESPONSE
{
  affectedRows: number
  insertId: 0
  warningStatus: number
}
```

#### **DELETE SELF-ENROLL**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`DELETE /courses/:courseId/selfenroll`

*This enpoint is reserved to logged users.*

Allows users to unenroll themselves in public courses. The user id and course id are taken from the token and the url parameter `:courseId`.

```ts
// RESPONSE
{
  affectedRows: number
  insertId: 0
  warningStatus: number
}
```

### **COURSE PROGRESS**
#### **GET PROGRESS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses/:courseId/progress`

*This enpoint is reserved to logged users enrolled in the concerned course.*

Allows user to consult what lessons they have completed in a course. The userId is taken from the token.

```ts
{
  userId: number
  courseId: number
  completeLessons: number
  completeLessonIds: number[]
}
```

*For the edition of progress stats, refer to the Lessons endpoints.


### **COURSE TOPICS**
#### **PUT TOPICS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`PUT /courses/:courseId/topics`

*This enpoint is reserved to the owner of the course.*

Allows the edition of the topics related of a course. A `PUT` request is used for both removing and adding topics.

The request object must bear all the topic ids to be added in an array. The response will bear the topics of the course (id and name).

*For a list of topics, please refer to the topic endpoint.*

```ts
// REQUEST

{
  topics: number[]
}

// RESPONSE

{
  topicId: number
  topicName: string
}
```

### **SECTIONS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`/courses/:courseId`
*The endpoints below are restricted to the owner of a course and its enrolled students, and other teachers.*

#### **GET SECTIONS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /sections`

Returns information on the sections of a course (without the lessons).

```ts
{
  sectionId: number
  sectionTitle: string
  sectionDescription: string
  sectionUploadDate: string
  sectionOwnerId: number
  sectionDateRestriction: string
  sectionOwnerFirst: string
  sectionOwnerLast: string
  sectionLastUpdate: string
  sectionOrder: number
}
```

#### **GET SECTION BY ID**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /sections/:sectionId`

Returns information on a particular section and its content.

```ts
{
  sectionId: number;
  sectionTitle: string;
  sectionDescription: string;
  sectionUploadDate: string;
  sectionOwnerId: number;
  sectionDateRestriction: string;
  sectionOwnerFirst: string;
  sectionOwnerLast: string;
  sectionLastUpdate: string;
  sectionOrder: number;
  sectionLessonsInfo: {
    lessonId: number;
    lessonTitle: string;
    lessonDescription: string;
    lessonUploadDate: string;
    lessonOrder: number;
    lessonDate: string | null;
  }
```

#### **POST SECTION**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`POST /sections/`

*This endpoint is reserved to teachers.*

Allows teachers to create sections within a course by providing at least a title, description and order. A restriction date can be added, students won't have access until the date has passed.

```ts
//REQUEST

{
  sectionTitle: string;
  sectionDescription: string;
  sectionOrder: number;
  sectionDateRestriction?: string;
}

// RESPONSE

{
  sectionId: string
  sectionTitle: string
  sectionDescription: string
  sectionOrder: string
  sectionOwnerId: string
  sectionCourseId: string
  sectionDateRestriction?: string;      // UTC format
}
```
#### **PUT SECTION**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`PUT /sections/:sectionId`

*This endpoint is reserved to the teacher owner of the course.*

Allows the edition of a section. The restriction can be added, modified, or removed. The reject will be rejected if no modification is made.

```ts
//REQUEST

{
  sectionTitle?: string;
  sectionDescription?: string;
  sectionOrder?: number;
  sectionDateRestriction?: string | null;   // UTC format
}

// RESPONSE

{
  sectionId: number
  sectionTitle: string
  sectionDescription: string
  sectionOwnerId: number
  sectionUploadDate: string                   // UTC format
  sectionDateRestriction: string | null       // UTC format
  sectionLastUpdate: string                   // UTC format
  sectionOwnerFirst: string
  sectionOwnerLast: string
  sectionOrder: number
  sectionLessonsInfo: {
    lessonId: number;
    lessonTitle: string;
    lessonDescription: string;
    lessonOrder: number;
    lessonUploadDate: string;                 //UTC format
    lessonDate: string | null;                // UTC format
  }
}
```

#### **DELETE SECTION**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`DELETE /sections/:sectionId`

*This endpoint is reserved to the teacher owner of the course.*

Marks the section as deleted in the database, but the data remains. All related lessons are set to deleted as well.

```ts
{
  affectedRows: number
  insertId: 0
  warningStatus: number
}
```

### **LESSONS**

#### **GET ALL LESSONS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses/:courseId/sections/:sectionId/lessons`

This endpoint will return a list of all the lessons that pertain to the coresponding course and section, based on the permission level of the client.

This endpoint is restricted to logged users. Teachers can access lessons in courses they own and are enrolled in. Students can access lessons in public courses and private courses they are enrolled in.
 
```ts
// REQUEST
{

}

// RESPONSE
{
  lessonId: number
  lessonTitle: string
  lessonDescription: string
  lessonOrder: number
  lessonUploadDate: string
  lessonDate: string
  lessonContent: string
  lessonIsDeleted: 1 | 0
  lessonSectionId: number
  courseOwnerId: number
}
```

#### **GET LESSON BY ID**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses/:courseId/sections/:sectionId/lessons/:lessonId`

This endpoint will return a object that contains lesson infromation pertaining to the coresponding course and section.

This endpoint is restricted logged users. Teachers can access lessons in courses they own and are enrolled in. Students can access lessons in public courses and private courses they are enrolled in.

```ts
// REQUEST
{

}

// RESPONSE
{
  lessonId: number
  lessonTitle: string
  lessonDescription: string
  lessonOrder: number
  lessonUploadDate: string
  lessonDate: string
  lessonLastUpdate: string
  lessonContent: string
  lessonIsDeleted: 1 | 0
  lessonSectionId: number
  courseOwnerId: number
}
```

#### **CREATE LESSON**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`POST /courses/:courseId/sections/:sectionId/lessons`

This endpoint will create a new lesson record that pertains to the coresponding course and section, based on the permission level of the client.

This endpoint is restricted to teachers that own the course they are modifying.

The lesson description can be typed in as a normal string or in markdown language and is converted into an HTML string by the form.

The lesson content is separated into a body and iFrames. The body contains the main part of the lesson's content, represented by an HTML string. The iFrames are additional attachments (such as embedded links to documents and videos) represented by an array of HTML strings. 

Since this is custom HTML, potential problematic tags are eliminated by an HTML sanitizer (NPM package **sanitize-html**). Its default settings are :
```ts
allowedTags: [
  "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
  "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
  "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
  "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
  "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
  "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
  "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr"
],
disallowedTagsMode: 'discard',
allowedAttributes: {
  a: [ 'href', 'name', 'target' ],
},
selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
// URL schemes we permit
allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'tel' ],
allowedSchemesByTag: {},
allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
allowProtocolRelative: true,
enforceHtmlBoundary: false
```

In addition to the default settings, the lesson body are filtered with the following settings:
```ts
allowedTags: ["img"],
allowediFrameAttributes = ['src']; // the src url is checked for safety
```

In addition to the default settings, the lesson Iframes are filtered with the following settings:
```ts
allowedTags: [
  "iframe"
],
allowediFrameAttributes = [
  'src',
  'style',
  'width',
  'height',
  'title',
  'frameborder',
  'allow',
  'autoplay',
  'clipboard-write',
  'encrypted-media',
  'gyroscope',
  'picture-in-picture',
  'allowfullscreen',
  'order',
  'orientation',
];
```

```ts
// REQUEST
{
  lessonTitle: string
  lessonDescription: string
  lessonOrder: number
  lessonDate: string
  lessonContent: {
    body: string
    iframes: string[]             // iframes can be an empty array, but a body is necessary
  }
}

// RESPONSE
{
  lessonId: number
  lessonTitle: string
  lessonDescription: string
  lessonOrder: number
  lessonDate: string
  lessonContent: {
    body: string
    iframes: string[]
  }
  lessonSectionId: number
}
```

#### **UPDATE LESSON**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`PUT /courses/:courseId/sections/:sectionId/lessons/:lessonId`

TThis endpoint will update a lesson record that corresponds to the specified course, section, and lesson ID number. The field that is to be changed is sent in the request along with its desired new data.

This endpoint is restricted to teachers that own the course they are modifying.

The lesson content is separated into a body and iFrames. The body contains the main part of the lesson's content, represented by an HTML string. The iFrames are additional attachments (such as embedded links to documents and videos) represented by an array of HTML strings. The HTML sanitizer settings mentioned above still apply.
 
```ts
// REQUEST
{
  lessonTitle?: string
  lessonDescription?: string
  lessonOrder?: number
  lessonDate?: string
  lessonContent?: {
    body: string
    iframes: string[]
  }
  lessonSectionId?: number
}

// RESPONSE
{
  lessonId: number
  lessonTitle: string
  lessonDescription: string
  lessonOrder: number
  lessonDate: string
  lessonContent: {
    body: string
    iframes: string[]
  }
  lessonSectionId: number
  lessonId: number
  courseOwnerId: number
}
```
#### **DELETE LESSON**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`DELETE /courses/:courseId/sections/:sectionId/lessons/:lessonId`

This endpoint will delete a lesson record that corresponds to the specified course, section, and lesson ID number. Users that have marked this lesson complete will also have their course progress updated accordingly.

This endpoint is restricted to teachers that own the course they are modifying.
 
```ts
// REQUEST
{

}

// RESPONSE
{
  affectedRows: number
  insertId: number
  warningStatus: number
}
```

#### **MARK LESSON AS COMPLETE**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`POST /courses/:courseId/sections/:sectionId/lessons/:lessonId/complete`

This endpoint will mark a lesson as complete, affecting the requester's course progress.

This endpoint is restricted to students that are enrolled in the course they are modifying.

```ts
// REQUEST
{

}

// RESPONSE
{
  affectedRows: number
  insertId: number
  warningStatus: number
}
```

#### **MARK LESSON AS INCOMPLETE**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`DELETE /courses/:courseId/sections/:sectionId/lessons/:lessonId/incomplete`

This endpoint will mark a lesson as incomplete, affecting the requester's course progress.

This endpoint is restricted to students that are enrolled in the course they are modifying.

```ts
// REQUEST
{

}

// RESPONSE
{
  affectedRows: number
  insertId: number
  warningStatus: number
}
```

### **ANNOUNCEMENTS**

#### **GET ALL COURSE ANNOUNCEMENTS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses/:courseId/announcements`

This endpoint will return a list of all the announcements that belong to the coresponding course.

This endpoint is restricted logged users. Teachers can access announcements in courses they own and are enrolled in. Students can access announcements in public courses and private courses they are enrolled in.
 
```ts
// REQUEST
{

}

// RESPONSE
{
  announcementId: number
  announcementTitle: string
  announcementContent: string
  announcementCourseId: number
  announcementUploadDate: Date
}
```

#### **GET ANNOUNCEMENT**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /courses/:courseId/announcements/:announcementId`

This endpoint will return the corresponding announcement specified by the given ID.

This endpoint is restricted to logged users. Teachers can access announcements in courses they own and are enrolled in. Students can access announcements in public courses and private courses they are enrolled in.
 
```ts
// REQUEST
{

}

// RESPONSE
{
  announcementId: number
  announcementTitle: string
  announcementContent: string
  announcementCourseId: number
  announcementUploadDate: Date
}
```

#### **UPDATE ANNOUNCEMENT**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`PUT /courses/:courseId/announcements/:announcementId`

This endpoint will update the corresponding announcement specified by the given ID.

This endpoint is restricted to logged users. Teachers can access announcements in courses they own and are enrolled in. Students can access announcements in public courses and private courses they are enrolled in.
 
```ts
// REQUEST
{
  announcementId: number
  announcementTitle: string
  announcementContent: string
  announcementCourseId: number
  announcementUploadDate: Date
}

// RESPONSE
{
  announcementId: number
  announcementTitle: string
  announcementContent: string
  announcementCourseId: number
  announcementUploadDate: Date
}
```
#### **DELETE ANNOUNCEMENT**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`DELETE /courses/:courseId/announcements/:announcementId`

This endpoint will delete the corresponding announcement specified by the given ID.

This endpoint is restricted to logged users. Teachers can access announcements in courses they own and are enrolled in. Students can access announcements in public courses and private courses they are enrolled in.
 
```ts
// REQUEST
{

}

// RESPONSE
{
  announcementId: number
}
```

### **TOPICS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`/topics/`

#### **GET ALL TOPICS**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`GET /topics`

 *This end point is public.*

Anyone can fetch a list of existing topics from our API. An array of objects made of the id and name of each topic will be sent.

```ts
{
  topicId: number
  topicName: string
}[]
```
