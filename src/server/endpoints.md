<h1>Courses</h1>

# `getAllCourses`      GET /courses
Get list of all courses in the system

# `getCourse` GET /courses/:course_id

URL params (optional) contains keywords for potential search.
  `column=col&value=val&categories=[cat1,cat2,...]`

- Determines whether to get private courses or not based on role (student/teacher vs. anon)
- If filtering by categories, use a `categories` URL param with an array value.


> All courses should have an extra column `accessible` that will be used to determine whether a course is accessible and clickable.  

- **Public users**
  - can visualise courses and their descriptions, but nothing more.

- **Logged users**
  - can visualise all courses and descriptions
  - can access the courses they are a part of, or which take groups the user belong to (not all are clickable);


# `createCourse`        POST /courses
```js
{
  "courseTitle":                string,
  "courseDescription":          string,
  "courseIsprivate":            true / false,
  "courseDateRestriction":      date,
  "courseTopics"?:              string[]
  // "courseMaintainers":     number[] DB table not yet
}
```
The authorId is extracted from req.user.

# `updateCourse`        PUT /courses/:id
Same as above, except that all the properties are optional. `course_history` must be updated in the service layer.

# `deleteCourse`        DELETE /courses/:id
The `is_deleted` property is set to `true`.

# `createTopic`      POST /topic *no PUT no DELETE*
```js
{
  "topic_name": string
}
```
<br>
<br>
<br>
<h1>Sections</h1>

# `getSection`      GET /sections/:id
Get list of lessons in the specified section

# `createSection`       POST /sections
```js
{
  "sectionTitle":                string,
  "sectionDescription":          string,
  "sectionDateRestriction":      date,
  "sectionCourseId":             number,
}
```
The authorId is extracted from req.user.

# `updateSection`        PUT /sections/:id
Same as above, except that all the properties are optional. `section_history` must be updated in the service layer.

# `deleteSection`        DELETE /sections/:id
The `is_deleted` property is set to `true`.

<br>
<br>
<br>
<h1>Lessons</h1>

# `getLessonInfo`      GET /lessons/:id
Get lesson content

# `createLesson`        POST /lessons
```js
{
  "lessonTitle":                string,
  "lessonDescription":          string,
  "lessonSectionId":             number,
  "lessonDate"?:                ?date,
}
```
The authorId is extracted from req.user.

# `updateLesson`        PUT /lessons/:id
Same as above, except that all the properties are optional. `lesson_history` must be updated in the service layer.

# `deleteLesson`        DELETE /lessons/:id
The `is_deleted` property is set to `true`.

# `markLessonComplete`     PUT /lessons/:id/complete
The `isdone` property of lesson_statuses is maked true

# `createResource` *(optional)*
Uses `multer` npm package and form data, we'll see later.

<br>
<br>
<br>
<h1>Students</h1>

# `getAllStudents`      GET /users/students
Get list of students

# `getStudent`      GET /users/students/:user_id
Get a student

# `getIsStudentEnrolled`      GET /users/enrollment/:course_id/:student_id
Get a student enrollment status in a course

# `getEnrolledStudents`      GET /users/enrolled/:course_id
Get students enrolled in the course

# `getUnenrolledStudents`      GET /users/unenrolled/:course_id
Get students not enrolled in the course

# `enrollStudent`      POST /users/enrollment/:course_id/:student_id
Enroll a student into a course

# `unenrollStudent`      DELETE /users/enrollment/:course_id/:student_id
Unenroll a student into a course

<br>
<br>
<br>
<h1>Teachers</h1>

# `getAllTeachers`      GET /users/teachers
Get list of teachers

# `getTeacher`      GET /users/teachers/:user_id
Get a teacher

<br>
<br>
<br>
<h1>Searching</h1>

# `searchCourses`      GET /courses/search
Get list of courses that match a search criteria

# `getMyCourses`      GET /courses/mycourses/:user_id
Get list of courses a user is enrolled in

<br>
<br>
<br>
<h1>Course Announcements</h1>

# `getAnnouncement`      GET /course/:course_id/announements/:announcement_id
Get an announcement of a course

# `getAnnouncements`      GET /course/:course_id/announements
Get list of announements of a specific course

# `createAnnouncement`       POST /course/:course_id/announements
```js
{
  "announcementTitle":            string,
  "announcementContent":          string,
  "announcementCourseId":          number,
}
```
The authorId is extracted from req.user.

# `updateAnnouncement`        PUT /course/:course_id/announements/:announcement_id
Announcement body is the same as above

# `deleteSection`        DELETE /course/:course_id/announements/:announcement_id
The `is_deleted` property is set to `true`.