/**
 * 
 */
package springmvc.demo.mybatis.web;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import springmvc.demo.mybatis.bean.user.User;
import springmvc.demo.mybatis.service.user.UserService;

/**
 * @author zhongli@isoftstone.com
 *
 */
@Controller
@RequestMapping("/home")
public class IndexController {
	
	@Resource
	private UserService userService;
	
	@RequestMapping("/index")
	public String index(Integer id, HttpServletRequest request){
		List<User> users = userService.getAllUser();
		request.setAttribute("users", users);
		return "index";
	}
	
	@RequestMapping("/index2")
	public ModelAndView index2(){
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("index");
		modelAndView.addObject("username", "lizhong");
		return modelAndView;
	}
}
