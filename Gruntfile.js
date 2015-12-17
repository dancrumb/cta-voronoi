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
                src: ['dist/*', 'node_modules/*', 'bower_components/*']
            }
        },
        copy: {
            dist: {
                files: [
                    {expand: true, cwd: 'bower_components', src: ['*/**'], dest: 'dist/js'},
                    {expand: true, cwd: 'src', src: ['*/**'], dest: 'dist/js'},
                    {expand: true, src: 'index.html', dest: 'dist', cwd: 'src'}
                ]            
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            gruntfile: {
                src: 'Gruntfile.js'
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
        },
        aws: {
            AWSAccessKeyId: process.env.AWS_ACCESS_KEY,
            AWSSecretKey: process.env.AWS_SECRET_KEY,
            bucket: "cta-voronoi"
        },
        aws_s3: {
            options: {
                region: 'us-east-1',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5 // 5 simultaneous downloads
            },
            production: {
                options: {
                    bucket: '<%= aws.bucket %>'
                },
                files: [
                    {expand: true, cwd: 'dist/', src: ['**'], dest: '/'}
                ]
            },
            clean_production: {
                options: {
                    bucket: '<%= aws.bucket %>'
                },
                files: [
                    {dest: '/', action: 'delete'}
                ]
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
    grunt.loadNpmTasks('grunt-aws-s3');

    // Default task
    grunt.registerTask('default', ['jshint', 'clean:dist', 'less', 'copy']);
};

