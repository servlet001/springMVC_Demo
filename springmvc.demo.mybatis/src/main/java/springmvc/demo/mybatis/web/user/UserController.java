/**
 * 
 */
package springmvc.demo.mybatis.web.user;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import springmvc.demo.mybatis.bean.user.User;
import springmvc.demo.mybatis.common.OperationPrompt;
import springmvc.demo.mybatis.service.user.UserService;

/**
 * @author zhongli@isoftstone.com
 * 用户controller
 */
@Controller
@RequestMapping("/user")
public class UserController {
	@Resource
	private UserService userService;
	
	@RequestMapping("/addUI")
	public String addUI(){
		return "user/addUser";
	}
	
	@RequestMapping("/add")
	public String add(User user, HttpServletRequest request){
		userService.save(user);
		OperationPrompt prompt = new OperationPrompt("添加用户成功", true);
		request.setAttribute("prompt", prompt);
		return "success";
	}

}
