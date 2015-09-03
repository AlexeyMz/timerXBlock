# -*- coding: utf-8 -*-
""" timerXBlock main Python class"""

import pkg_resources
from django.core.urlresolvers import reverse
from django.template import Context, Template

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String, Boolean
from xblock.fragment import Fragment

class timerXBlock(XBlock):

    '''
    Icon of the XBlock. Values : [other (default), video, problem]
    '''
    icon_class = "other"

    '''
    Fields
    '''
    display_name = String(display_name=u"Название блока",
        default=u"Ограничение по времени",
        scope=Scope.settings,
        help=u"Название блока, отображаемое в строке навигации в верхней части страницы.")

    time_limit_seconds = Integer(display_name=u"Ограничение по времени (секунды)",
        default="1200",
        scope=Scope.content,
        help=u"Ограничение по времени на прохождение тестирования в секундах.")
    
    redirect_url = String(display_name=u"URL для перехода при окончании тестирования",
        default="",
        scope=Scope.content,
        help=u"Адрес страницы, на которую будет осуществлён переход при истечении времени тестирования.")

    '''
    Util functions
    '''
    def load_resource(self, resource_path):
        """
        Gets the content of a resource
        """
        resource_content = pkg_resources.resource_string(__name__, resource_path)
        return unicode(resource_content)

    def render_template(self, template_path, context={}):
        """
        Evaluate a template by resource path, applying the provided context
        """
        template_str = self.load_resource(template_path)
        return Template(template_str).render(Context(context))

    '''
    Main functions
    '''
    def student_view(self, context=None):
        """
        The primary view of the XBlock, shown to students
        when viewing courses.
        """
        context = {
            'display_name': self.display_name,
            'time_limit_seconds': self.time_limit_seconds,
            'redirect_url': self.redirect_url,
            'l10n': {
                'start_exam': u"На тестирование отводится {}",
                'action_begin': u"Приступить к тесту",
                'time_over': u"Время на выполнение теста истекло",
                'action_see_results': u"Перейти к результатам",
                'minutes_forms': u'["минута","минуты","минут"]',
                'seconds_forms': u'["секунда","секунды","секунд"]',
            },
            'student_has_course_state_url': reverse('student_has_course_state',
                kwargs={'course_id': unicode(course_key)}),
            'reset_all_student_attempts_url': reverse('reset_all_student_attempts',
                kwargs={'course_id': unicode(course_key)}),
        }
        html = self.render_template('static/html/timer_view.html', context)
        
        frag = Fragment(html)
        frag.add_css(self.load_resource("static/css/timer.css"))
        frag.add_css(self.load_resource("static/css/timeTo.css"))
        frag.add_javascript(self.load_resource("static/js/timer_view.js"))
        frag.add_javascript(self.load_resource("static/js/jquery.timeTo.js"))
        frag.initialize_js('timerXBlockInitView')
        return frag
    
    def author_view(self, context):
        context = {
            'display_name': self.display_name,
            'time_limit_seconds': self.time_limit_seconds,
            'redirect_url': self.redirect_url,
        }
        html = self.render_template('static/html/timer_author.html', context)
        
        frag = Fragment(html)
        frag.add_css(self.load_resource("static/css/timer.css"))
        frag.add_css(self.load_resource("static/css/timeTo.css"))
        frag.add_javascript(self.load_resource("static/js/timer_author.js"))
        frag.add_javascript(self.load_resource("static/js/jquery.timeTo.js"))
        frag.initialize_js('timerXBlockInitAuthor')
        return frag

    def studio_view(self, context=None):
        """
        The secondary view of the XBlock, shown to teachers
        when editing the XBlock.
        """
        context = {
            'display_name': self.display_name,
            'time_limit_seconds': self.time_limit_seconds,
            'redirect_url': self.redirect_url,
        }
        html = self.render_template('static/html/timer_edit.html', context)
        
        frag = Fragment(html)
        frag.add_css(self.load_resource("static/css/timer.css"))
        frag.add_css(self.load_resource("static/css/timeTo.css"))
        frag.add_javascript(self.load_resource("static/js/timer_edit.js"))
        frag.add_javascript(self.load_resource("static/js/jquery.timeTo.js"))
        frag.initialize_js('timerXBlockInitEdit')
        return frag

    @XBlock.json_handler
    def save_flash(self, data, suffix=''):
        """
        The saving handler.
        """
        self.display_name = data['display_name']
        self.time_limit_seconds = data['time_limit_seconds']
        self.redirect_url = data['redirect_url']
        
        return {
            'result': 'success',
        }
