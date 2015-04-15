module.exports = function (grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= props.license %> */\n',
        // Task configuration
        clean: {
            dist: {
                src: ['dist/*']
            }
        },
        copy: {
            dist: {
                files: [
                    {expand: true, cwd: 'bower_components', src: ['*/**'], dest: 'dist/js'},
                    {expand: true, cwd: 'src', src: ['*/**'], dest: 'dist/js'},
                    {expand: true, src: 'index.html', dest: 'dist', cwd: 'src'}
                ]            
            },
        },
        jshint: {
            options: {
                node: false,
                dojo: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                devel: true,
                globals: { 
                    define: true,
                    require: true,
                    module: true
                },
                boss: true
            },
            gruntfile: {
                src: 'gruntfile.js'
            },
            lib_test: {
                src: ['src/**/*.js']
            }
        },
        less: {
            dist: {
                files: {
                    'dist/css/main.css': 'src/style/main.less'
                }
                
            }
        },
        watch: {
            src: {
                files: 'src/**',
                tasks: ['less','copy']
            }
        }
    });

    // These plugins provide necessary tasks

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-dojo');

    // Default task
    grunt.registerTask('default', ['jshint', 'clean:dist', 'less', 'copy']);
};

