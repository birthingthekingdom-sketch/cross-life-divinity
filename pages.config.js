module.exports = [
  // Main Pages
  { template: 'index.ejs', output: 'index.html', data: { title: "Home" } },
  { template: 'login.ejs', output: 'login.html', data: { title: "Login" } },
  { template: 'courses.ejs', output: 'courses/index.html', data: { title: "All Courses" } },

  // Theology Courses (19)
  { template: 'course.ejs', output: 'courses/bib101/index.html', data: { courseId: 'BIB101', title: "Old Testament Survey" } },
  { template: 'course.ejs', output: 'courses/bib102/index.html', data: { courseId: 'BIB102', title: "New Testament Survey" } },
  { template: 'course.ejs', output: 'courses/bib103/index.html', data: { courseId: 'BIB103', title: "Biblical Hermeneutics" } },
  { template: 'course.ejs', output: 'courses/the201/index.html', data: { courseId: 'THE201', title: "Systematic Theology" } },
  { template: 'course.ejs', output: 'courses/the301/index.html', data: { courseId: 'THE301', title: "Fundamentals of Apologetics" } },
  { template: 'course.ejs', output: 'courses/div101/index.html', data: { courseId: 'DIV101', title: "Understanding Prophecy" } },
  { template: 'course.ejs', output: 'courses/min101/index.html', data: { courseId: 'MIN101', title: "Evangelism and Discipleship" } },
  { template: 'course.ejs', output: 'courses/min102/index.html', data: { courseId: 'MIN102', title: "Discipleship Training" } },
  { template: 'course.ejs', output: 'courses/led202/index.html', data: { courseId: 'LED202', title: "Christian Leadership" } },
  { template: 'course.ejs', output: 'courses/pas201/index.html', data: { courseId: 'PAS201', title: "Pastoral Counseling" } },
  { template: 'course.ejs', output: 'courses/pas301/index.html', data: { courseId: 'PAS301', title: "Church Administration" } },
  { template: 'course.ejs', output: 'courses/spr101/index.html', data: { courseId: 'SPR101', title: "Prayer and Intercession" } },
  { template: 'course.ejs', output: 'courses/spr201/index.html', data: { courseId: 'SPR201', title: "Discovering Spiritual Gifts" } },
  { template: 'course.ejs', output: 'courses/wor101/index.html', data: { courseId: 'WOR101', title: "Biblical Worship" } },
  { template: 'course.ejs', output: 'courses/div102/index.html', data: { courseId: 'DIV102', title: "Deliverance Ministry" } },
  { template: 'course.ejs', output: 'courses/pas101/index.html', data: { courseId: 'PAS101', title: "Homiletics" } },
  { template: 'course.ejs', output: 'courses/div111/index.html', data: { courseId: 'DIV111', title: "Capstone Project" } },
  { template: 'course.ejs', output: 'courses/div112/index.html', data: { courseId: 'DIV112', title: "Christology" } },
  { template: 'course.ejs', output: 'courses/div113/index.html', data: { courseId: 'DIV113', title: "Contemporary Theological Issues" } },

  // GED Courses (4)
  { template: 'course.ejs', output: 'courses/ged-math/index.html', data: { courseId: 'GED-MATH', title: "Mathematical Reasoning" } },
  { template: 'course.ejs', output: 'courses/ged-rla/index.html', data: { courseId: 'GED-RLA', title: "Reasoning Through Language Arts" } },
  { template: 'course.ejs', output: 'courses/ged-science/index.html', data: { courseId: 'GED-SCIENCE', title: "Science" } },
  { template: 'course.ejs', output: 'courses/ged-social/index.html', data: { courseId: 'GED-SOCIAL', title: "Social Studies" } },

  // Chaplaincy (1)
  { template: 'course.ejs', output: 'courses/chap101/index.html', data: { courseId: 'CHAP101', title: "Chaplaincy Training" } },
];
