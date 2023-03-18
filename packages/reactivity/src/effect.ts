import { isArray } from '@vue/shared'
import { createDep, Dep } from './dep'

type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)
  // 收集依赖，触发get
  _effect.run()
}

export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
  deps: Dep[] = []

  constructor(public fn: () => T) {}
  run() {
    // 当前被执行的effect
    activeEffect = this
    return this.fn()
  }
}

/**
 * 收集依赖函数
 * @param target
 * @param key
 */
export function track(target: object, key: unknown) {
  // console.log('收集依赖')
  if (!activeEffect) return
  // 每个被代理对象的依赖都是map
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  // 每个对象的key都有许多依赖，有可能是重复的，用set
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }

  trackEffects(dep)
}

/**
 * 利用dep 依次跟踪key的所有effect
 * @param dep
 */
export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
  activeEffect!.deps.push(dep)
}

/**
 * 触发依赖函数
 * @param target
 * @param key
 * @param newValue
 */
export function trigger(target: object, key: unknown, newValue: unknown) {
  // console.log('触发依赖')
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const dep = depsMap.get(key) as Set<ReactiveEffect>

  if (dep && !dep.size) return
  triggerEffects(dep)
}
/**
 * 依次触发dep中保存的依赖
 * @param dep
 */
export function triggerEffects(dep: Dep) {
  const effects = isArray(dep) ? dep : [...dep]

  for (const effect of effects) {
    triggerEffect(effect)
  }
}

export function triggerEffect(effect: ReactiveEffect) {
  effect.run()
}
