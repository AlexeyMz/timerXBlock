# -*- coding: utf-8 -*-
""" timerXBlock main Python class"""

import pkg_resources
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
    display_name = String(display_name="Название блока",
        default="Time Limit",
        scope=Scope.settings,
        help="Название блока, отображаемое в строке навигации в верхней части страницы.")

    time_limit_seconds = Integer(display_name="Ограничение по времени (секунды)",
        default="1200",
        scope=Scope.content,
        help="Ограничение по времени на прохождение тестирования в секундах.")
    
    redirect_url = String(display_name="URL для перехода при окончании тестирования",
        default="",
        scope=Scope.content,
        help="Адрес страницы, на которую будет осуществлён переход при истечении времени тестирования.")

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
        }
        html = self.render_template('static/html/timer_view.html', context)
        
        frag = Fragment(html)
        frag.add_css(self.load_resource("static/css/timer.css"))
        frag.add_css(self.load_resource("static/css/timeTo.css"))
        frag.add_javascript(self.load_resource("static/js/timer_view.js"))
        frag.add_javascript(self.load_resource("static/js/jquery.timeTo.js"))
        frag.initialize_js('timerXBlockInitView')
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
