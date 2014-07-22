package springmvc.demo.mybatis.service.user;

import java.util.List;

import springmvc.demo.mybatis.bean.user.User;

public interface UserService {
	public User getUserById(Integer id);
	
	public void save(User user);
	
	/**
	 * 获取所有的用户
	 * @return
	 */
	public List<User> getAllUser();
}
